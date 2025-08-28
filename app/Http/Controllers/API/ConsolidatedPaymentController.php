<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\ConsolidatedPayment;
use App\Models\ConsolidatedPaymentDetail;
//use App\Models\Payment;
use App\Repositories\ConsolidatedPaymentRepository;
use App\Repositories\ConsolidatedReportRepository;
use App\Http\Requests\ConsolidatedPaymentRequest;
use Carbon\Carbon;
use App\Models\Currency;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ConsolidatedPaymentController extends AppBaseController
{
    protected $consolidatedPaymentRepo;
    protected $consolidatedReportRepo;

    public function __construct(
        ConsolidatedPaymentRepository $consolidatedPaymentRepo,
        ConsolidatedReportRepository $consolidatedReportRepo
    ) {
        $this->consolidatedPaymentRepo = $consolidatedPaymentRepo;
        $this->consolidatedReportRepo = $consolidatedReportRepo;
    }

    /**
     * Obtener la moneda del sistema desde la tabla currencies
     */
    private function getSystemCurrency()
    {
        try {
            // Opción 1: Buscar por configuración default_currency_id
            $defaultCurrencyId = \App\Models\Setting::where('key', 'default_currency_id')
                ->value('value');

            if ($defaultCurrencyId) {
                $currency = Currency::find($defaultCurrencyId);
                if ($currency) {
                    return $currency->symbol; // Retorna ₹
                }
            }

            // Opción 2: Buscar por código INR
            $currency = Currency::where('code', 'INR')->first();
            if ($currency) {
                return $currency->symbol; // Retorna ₹
            }

            // Opción 3: Tomar la primera moneda disponible
            $currency = Currency::orderBy('id')->first();
            if ($currency) {
                return $currency->symbol;
            }

            // Fallback final
            return '₹';
        } catch (\Exception $e) {
            \Log::error('Error getting system currency: ' . $e->getMessage());
            return '₹';
        }
    }

    /**
     * Obtener ventas consolidadas por cliente
     */
    public function getConsolidatedSales(Request $request)
    {
        try {
            $warehouseId = $request->get('warehouse_id');

            // Obtener la moneda del sistema
            $systemCurrency = $this->getSystemCurrency();

            $query = Sale::with(['customer', 'payments'])
                ->whereIn('payment_status', [2, 3]) // No pagado y Parcial
                ->where('grand_total', '>', 0);

            if ($warehouseId) {
                $query->where('warehouse_id', $warehouseId);
            }

            $sales = $query->get();

            // Agrupar por cliente
            $consolidatedSales = $sales->groupBy('customer_id')->map(function ($customerSales, $customerId) use ($systemCurrency) {
                $customer = $customerSales->first()->customer;
                $totalGrandTotal = $customerSales->sum('grand_total');
                $totalPaid = $customerSales->sum('paid_amount');
                $totalPending = $totalGrandTotal - $totalPaid;
                $salesCount = $customerSales->count();

                // Usar la moneda del sistema en lugar de USD
                $firstSale = $customerSales->first();
                $currency = $firstSale->currency ?? $systemCurrency;

                // Obtener detalles de cada venta
                $salesDetails = $customerSales->map(function ($sale) use ($systemCurrency) {
                    return [
                        'id' => $sale->id,
                        'reference_code' => $sale->reference_code ?? $sale->reference_no ?? 'N/A',
                        'date' => $sale->date,
                        'grand_total' => $sale->grand_total,
                        'paid_amount' => $sale->paid_amount,
                        'pending_amount' => $sale->grand_total - $sale->paid_amount,
                        'payment_status' => $sale->payment_status,
                        'created_at' => $sale->created_at,
                        'currency' => $sale->currency ?? $systemCurrency // Usar moneda del sistema
                    ];
                })->sortBy('created_at')->values(); // Ordenar por fecha de creación (FIFO)

                return [
                    'customer_id' => $customerId,
                    'customer_name' => $customer ? $customer->name : 'Cliente no encontrado',
                    'customer_email' => $customer ? $customer->email : null,
                    'customer_phone' => $customer ? $customer->phone_number : null,
                    'total_grand_total' => $totalGrandTotal,
                    'total_paid' => $totalPaid,
                    'total_pending' => $totalPending,
                    'sales_count' => $salesCount,
                    'currency' => $currency, // Ahora será ₹ en lugar de USD
                    'sales_details' => $salesDetails
                ];
            })->values();

            // Ordenar por monto pendiente (mayor a menor)
            $consolidatedSales = $consolidatedSales->sortByDesc('total_pending')->values();

            return response()->json([
                'success' => true,
                'data' => $consolidatedSales,
                'message' => 'Ventas consolidadas obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ventas consolidadas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Procesar pago consolidado usando Repository
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Log raw input para debugging
            Log::info('Raw consolidated payment request:', $request->all());

            // Validación manual en lugar de ConsolidatedPaymentRequest
            $validator = Validator::make($request->all(), [
                'reference' => 'required|string|max:255',
                'payment_date' => 'required|date',
                'payment_type' => 'required|integer',
                'amount' => 'required|numeric|min:0.01',
                'consolidated_sales' => 'required|array|min:1',
                'consolidated_sales.*.id' => 'required|integer',
                'customer_id' => 'required|integer',
                'payment_allocation' => 'required|array|min:1',
                'payment_allocation.*.sale_id' => 'required|integer',
                'payment_allocation.*.allocated_amount' => 'required|numeric|min:0',
                'total_allocated' => 'required|numeric|min:0',
                'remaining_payment' => 'nullable|numeric|min:0',
                'is_consolidated' => 'boolean'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed:', $validator->errors()->toArray());
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }

            $input = $validator->validated();
            Log::info('Validated input:', $input);

            // Extraer y validar los sale IDs de manera más segura
            $saleIds = [];
            if (isset($input['consolidated_sales']) && is_array($input['consolidated_sales'])) {
                foreach ($input['consolidated_sales'] as $sale) {
                    if (isset($sale['id']) && is_numeric($sale['id'])) {
                        $saleIds[] = (int) $sale['id'];
                    }
                }
                $saleIds = array_unique($saleIds);
            }

            Log::info('Extracted sale IDs:', $saleIds);

            // Extraer y validar payment allocations de manera más segura
            $paymentAllocations = [];
            if (isset($input['payment_allocation']) && is_array($input['payment_allocation'])) {
                foreach ($input['payment_allocation'] as $allocation) {
                    if (isset($allocation['sale_id']) &&
                        isset($allocation['allocated_amount']) &&
                        is_numeric($allocation['sale_id']) &&
                        is_numeric($allocation['allocated_amount']) &&
                        $allocation['allocated_amount'] > 0) {

                        $paymentAllocations[] = [
                            'sale_id' => (int) $allocation['sale_id'],
                            'allocated_amount' => (float) $allocation['allocated_amount'],
                            'due_amount' => (float) ($allocation['due_amount'] ?? 0),
                            'remaining_due' => (float) ($allocation['remaining_due'] ?? 0),
                            'grand_total' => (float) ($allocation['grand_total'] ?? 0),
                            'paid_amount' => (float) ($allocation['paid_amount'] ?? 0),
                        ];
                    }
                }
            }

            Log::info('Extracted payment allocations:', $paymentAllocations);

            // Validar que tenemos datos válidos
            if (empty($saleIds)) {
                Log::error('No valid sale IDs found');
                return $this->sendError(
                    'Validation Error',
                    ['consolidated_sales' => ['No valid sales provided']],
                    422
                );
            }

            if (empty($paymentAllocations)) {
                Log::error('No valid payment allocations found');
                return $this->sendError(
                    'Validation Error',
                    ['payment_allocation' => ['No valid payment allocations provided']],
                    422
                );
            }

            // Preparar datos para el repository
            $paymentData = [
                'reference' => $input['reference'],
                'payment_date' => $input['payment_date'],
                'payment_type' => (int) $input['payment_type'],
                'amount' => (float) $input['amount'],
                'customer_id' => (int) $input['customer_id'],
                'is_consolidated' => $input['is_consolidated'] ?? true,
                'total_allocated' => (float) $input['total_allocated'],
                'remaining_payment' => (float) ($input['remaining_payment'] ?? 0),
            ];

            Log::info('Payment data prepared:', $paymentData);

            // Verificar que todos los parámetros no sean null antes de llamar al repository
            if (is_null($paymentData['customer_id']) ||
                is_null($saleIds) ||
                is_null($paymentData['amount']) ||
                is_null($paymentAllocations) ||
                is_null($paymentData)) {

                Log::error('Null values detected in parameters', [
                    'customer_id_is_null' => is_null($paymentData['customer_id']),
                    'sale_ids_is_null' => is_null($saleIds),
                    'amount_is_null' => is_null($paymentData['amount']),
                    'allocations_is_null' => is_null($paymentAllocations),
                    'payment_data_is_null' => is_null($paymentData)
                ]);

                return $this->sendError('Invalid parameters: null values detected', 422);
            }

            Log::info('About to call repository with:', [
                'customer_id' => $paymentData['customer_id'],
                'sale_ids_count' => count($saleIds),
                'sale_ids' => $saleIds,
                'payment_amount' => $paymentData['amount'],
                'allocations_count' => count($paymentAllocations)
            ]);

            // Procesar el pago consolidado
            $consolidatedPayment = $this->consolidatedPaymentRepo->processConsolidatedPayment(
                $paymentData['customer_id'],
                $saleIds,
                $paymentData['amount'],
                $paymentAllocations,
                $paymentData
            );

            Log::info('Consolidated payment created successfully:', [
                'payment_id' => $consolidatedPayment->id ?? 'unknown'
            ]);

            return $this->sendResponse(
                $consolidatedPayment,
                'Consolidated payment created successfully'
            );

        } catch (\Exception $e) {
            Log::error('Error creating consolidated payment:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'input' => $request->all()
            ]);

            return $this->sendError(
                'Error creating consolidated payment: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Obtener historial de pagos consolidados
     */
    public function getConsolidatedPaymentHistory(Request $request)
    {
        try {
            $customerId = $request->get('customer_id');
            $warehouseId = $request->get('warehouse_id');

            $query = ConsolidatedPayment::with(['customer', 'details.sale'])
                ->orderBy('created_at', 'desc');

            if ($customerId) {
                $query->where('customer_id', $customerId);
            }

            if ($warehouseId) {
                $query->whereHas('details.sale', function ($q) use ($warehouseId) {
                    $q->where('warehouse_id', $warehouseId);
                });
            }

            $payments = $query->get();

            $formattedPayments = $payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'reference' => $payment->reference,
                    'customer_name' => $payment->customer->name,
                    'total_amount' => $payment->total_amount,
                    'payment_date' => $payment->payment_date,
                    'payment_type' => $payment->payment_type,
                    'notes' => $payment->notes,
                    'sales_count' => $payment->details->count(),
                    'details' => $payment->details->map(function ($detail) {
                        return [
                            'sale_id' => $detail->sale_id,
                            'sale_reference' => $detail->sale->reference_no,
                            'amount' => $detail->amount,
                            'sale_date' => $detail->sale->date
                        ];
                    })
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedPayments,
                'message' => 'Historial obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener historial: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar detalles de un pago consolidado específico
     */
    public function show($id)
    {
        try {
            $consolidatedPayment = ConsolidatedPayment::with([
                'customer',
                'details.sale' => function ($query) {
                    $query->select('id', 'reference_no', 'date', 'grand_total', 'paid_amount', 'payment_status');
                }
            ])->findOrFail($id);

            $paymentData = [
                'id' => $consolidatedPayment->id,
                'reference' => $consolidatedPayment->reference,
                'customer' => [
                    'id' => $consolidatedPayment->customer->id,
                    'name' => $consolidatedPayment->customer->name,
                    'email' => $consolidatedPayment->customer->email,
                    'phone' => $consolidatedPayment->customer->phone_number
                ],
                'total_amount' => $consolidatedPayment->total_amount,
                'payment_date' => $consolidatedPayment->payment_date,
                'payment_type' => $consolidatedPayment->payment_type,
                'payment_type_name' => $consolidatedPayment->payment_type_name,
                'notes' => $consolidatedPayment->notes,
                'created_at' => $consolidatedPayment->created_at,
                'details' => $consolidatedPayment->details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'sale_id' => $detail->sale_id,
                        'sale_reference' => $detail->sale->reference_no,
                        'sale_date' => $detail->sale->date,
                        'amount_applied' => $detail->amount,
                        'sale_total' => $detail->sale->grand_total,
                        'sale_paid' => $detail->sale->paid_amount,
                        'sale_status' => $detail->sale->payment_status
                    ];
                })
            ];

            return response()->json([
                'success' => true,
                'data' => $paymentData,
                'message' => 'Detalles del pago consolidado obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener detalles del pago: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener resumen de pagos consolidados usando Repository
     */
    public function getConsolidatedSummary(Request $request)
    {
        try {
            $filters = [
                'warehouse_id' => $request->get('warehouse_id'),
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to')
            ];

            $summary = $this->consolidatedReportRepo->generateSummaryReport($filters);

            return response()->json([
                'success' => true,
                'data' => $summary,
                'message' => 'Resumen obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener resumen: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validar que las ventas sean elegibles para pago consolidado
     */
    public function validateSalesForConsolidation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|integer|exists:customers,id',
            'sale_ids' => 'required|array|min:1',
            'sale_ids.*' => 'integer|exists:sales,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $customerId = $request->customer_id;
            $saleIds = $request->sale_ids;

            $sales = Sale::whereIn('id', $saleIds)
                ->where('customer_id', $customerId)
                ->get();

            $validationResults = [];
            $totalEligible = 0;
            $totalPending = 0;

            foreach ($sales as $sale) {
                $pendingAmount = $sale->grand_total - $sale->paid_amount;
                $isEligible = in_array($sale->payment_status, [2, 3]) && $pendingAmount > 0;

                $validationResults[] = [
                    'sale_id' => $sale->id,
                    'reference_no' => $sale->reference_no,
                    'grand_total' => $sale->grand_total,
                    'paid_amount' => $sale->paid_amount,
                    'pending_amount' => $pendingAmount,
                    'payment_status' => $sale->payment_status,
                    'is_eligible' => $isEligible,
                    'reason' => $isEligible ? 'Elegible' : 'Venta ya pagada o sin monto pendiente'
                ];

                if ($isEligible) {
                    $totalEligible++;
                    $totalPending += $pendingAmount;
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'validation_results' => $validationResults,
                    'summary' => [
                        'total_sales' => count($sales),
                        'eligible_sales' => $totalEligible,
                        'total_pending_amount' => $totalPending,
                        'can_consolidate' => $totalEligible > 0
                    ]
                ],
                'message' => 'Validación completada'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en validación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas para dashboard usando Repository
     */
    public function getDashboardStats(Request $request)
    {
        try {
            $warehouseId = $request->get('warehouse_id');
            $period = $request->get('period', 'month');

            $filters = [
                'warehouse_id' => $warehouseId,
                'period' => $period
            ];

            $stats = $this->consolidatedReportRepo->getDashboardStatistics($filters);

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estadísticas obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancelar pago consolidado con validaciones de seguridad
     */
    public function cancel($id)
    {
        // Verificar permisos especiales
        if (!auth()->user()->can('cancel_consolidated_payments')) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para cancelar pagos consolidados'
            ], 403);
        }

        try {
            $result = $this->consolidatedPaymentRepo->cancelConsolidatedPayment($id);

            return response()->json([
                'success' => true,
                'message' => 'Pago consolidado cancelado exitosamente',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cancelar pago consolidado: ' . $e->getMessage()
            ], 500);
        }
    }
}
