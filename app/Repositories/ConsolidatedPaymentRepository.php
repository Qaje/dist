<?php

namespace App\Repositories;

use App\Models\ConsolidatedPayment;
use App\Models\Sale;
use App\Models\SalesPayment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ConsolidatedPaymentRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'reference',
        'payment_date',
        'customer_id',
        'amount'
    ];

    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    public function model(): string
    {
        return ConsolidatedPayment::class;
    }

    /**
     * Process consolidated payment for multiple sales
     */
    public function processConsolidatedPayment($customerId, $saleIds, $paymentAmount, $allocations, $paymentData)
    {
        Log::info('Repository processConsolidatedPayment called with:', [
            'customerId' => $customerId,
            'saleIds' => $saleIds,
            'paymentAmount' => $paymentAmount,
            'allocations_count' => is_array($allocations) ? count($allocations) : 'not_array',
            'paymentData' => $paymentData
        ]);

        // Validar parámetros de entrada de manera más robusta
        if (is_null($customerId) || empty($customerId) || !is_numeric($customerId)) {
            throw new \InvalidArgumentException('Customer ID is required and must be numeric. Received: ' . var_export($customerId, true));
        }

        if (is_null($saleIds) || !is_array($saleIds) || empty($saleIds)) {
            throw new \InvalidArgumentException('Sale IDs must be a non-empty array. Received: ' . var_export($saleIds, true));
        }

        // Validar que todos los sale IDs sean numéricos
        foreach ($saleIds as $saleId) {
            if (!is_numeric($saleId)) {
                throw new \InvalidArgumentException('All sale IDs must be numeric. Found: ' . var_export($saleId, true));
            }
        }

        if (is_null($paymentAmount) || !is_numeric($paymentAmount) || $paymentAmount <= 0) {
            throw new \InvalidArgumentException('Payment amount must be a positive number. Received: ' . var_export($paymentAmount, true));
        }

        if (is_null($allocations) || !is_array($allocations) || empty($allocations)) {
            throw new \InvalidArgumentException('Payment allocations must be a non-empty array. Received: ' . var_export($allocations, true));
        }

        if (is_null($paymentData) || !is_array($paymentData)) {
            throw new \InvalidArgumentException('Payment data must be an array. Received: ' . var_export($paymentData, true));
        }

        return DB::transaction(function () use ($customerId, $saleIds, $paymentAmount, $allocations, $paymentData) {

            Log::info('Starting consolidated payment transaction', [
                'customer_id' => $customerId,
                'sale_ids' => $saleIds,
                'payment_amount' => $paymentAmount
            ]);

            // Convertir a enteros y filtrar valores válidos
            $validSaleIds = array_filter(array_map('intval', $saleIds), function($id) {
                return $id > 0;
            });

            if (empty($validSaleIds)) {
                throw new \Exception('No valid sale IDs after filtering');
            }

            Log::info('Valid sale IDs after filtering:', $validSaleIds);

            // Obtener las ventas y validar que existan
            try {
                $sales = Sale::whereIn('id', $validSaleIds)
                    ->where('customer_id', intval($customerId))
                    ->get();
            } catch (\Exception $e) {
                Log::error('Error querying sales:', [
                    'error' => $e->getMessage(),
                    'sale_ids' => $validSaleIds,
                    'customer_id' => $customerId
                ]);
                throw new \Exception('Error retrieving sales: ' . $e->getMessage());
            }

            if ($sales->isEmpty()) {
                throw new \Exception('No sales found for customer ID ' . $customerId . ' with the provided sale IDs: ' . implode(', ', $validSaleIds));
            }

            $foundSaleIds = $sales->pluck('id')->toArray();
            Log::info('Found sales with IDs:', $foundSaleIds);

            // Crear el registro de pago consolidado
            try {
                $consolidatedPayment = ConsolidatedPayment::create([
                    'reference' => $paymentData['reference'],
                    'payment_date' => $paymentData['payment_date'],
                    'payment_type' => intval($paymentData['payment_type']),
                    'amount' => floatval($paymentData['amount']),
                    'customer_id' => intval($customerId),
                    'is_consolidated' => true,
                    'total_allocated' => floatval($paymentData['total_allocated']),
                    'remaining_payment' => floatval($paymentData['remaining_payment']),
                    'payment_allocations' => $allocations,
                ]);

                Log::info('Created consolidated payment:', ['id' => $consolidatedPayment->id]);
            } catch (\Exception $e) {
                Log::error('Error creating consolidated payment:', [
                    'error' => $e->getMessage(),
                    'payment_data' => $paymentData
                ]);
                throw new \Exception('Error creating consolidated payment: ' . $e->getMessage());
            }

            // Procesar cada asignación de pago
            foreach ($allocations as $allocation) {
                try {
                    $allocationAmount = floatval($allocation['allocated_amount'] ?? 0);
                    $saleId = intval($allocation['sale_id'] ?? 0);

                    if ($allocationAmount <= 0) {
                        Log::warning('Skipping allocation with zero or negative amount', $allocation);
                        continue;
                    }

                    if ($saleId <= 0) {
                        Log::warning('Skipping allocation with invalid sale ID', $allocation);
                        continue;
                    }

                    $sale = $sales->where('id', $saleId)->first();

                    if (!$sale) {
                        Log::warning('Sale not found for allocation', ['sale_id' => $saleId]);
                        continue;
                    }

                    // Crear el registro de pago individual para cada venta
                    $salePayment = SalesPayment::create([
                        'sale_id' => $saleId,
                        'amount' => $allocationAmount,
                        'payment_date' => $paymentData['payment_date'],
                        'payment_type' => intval($paymentData['payment_type']),
                        'reference' => $paymentData['reference'] . '-SALE-' . $saleId,
                        'consolidated_payment_id' => $consolidatedPayment->id,
                        'received_amount' => floatval($allocation['due_amount'] ?? 0),
                        'notes' => 'Consolidated payment allocation'
                    ]);

                    Log::info('Created sale payment', ['sale_payment_id' => $salePayment->id]);

                    // Actualizar el monto pagado de la venta
                    $currentPaidAmount = floatval($sale->paid_amount);
                    $newPaidAmount = $currentPaidAmount + $allocationAmount;

                    $newPaymentStatus = $this->calculatePaymentStatus(
                        $sale->grand_total,
                        $newPaidAmount
                    );

                    $sale->update([
                        'paid_amount' => $newPaidAmount,
                        'payment_status' => $newPaymentStatus
                    ]);

                    Log::info("Updated sale {$sale->id}", [
                        'previous_paid' => $currentPaidAmount,
                        'allocation' => $allocationAmount,
                        'new_paid' => $newPaidAmount,
                        'grand_total' => $sale->grand_total,
                        'new_status' => $newPaymentStatus
                    ]);

                } catch (\Exception $e) {
                    Log::error('Error processing allocation:', [
                        'allocation' => $allocation,
                        'error' => $e->getMessage()
                    ]);
                    // Continue with next allocation instead of failing completely
                    continue;
                }
            }

            // Recargar con relaciones
            try {
                $consolidatedPayment = $consolidatedPayment->fresh(['customer', 'salePayments.sale']);
            } catch (\Exception $e) {
                Log::warning('Could not load relationships:', ['error' => $e->getMessage()]);
                // Return without relationships if there's an error
            }

            Log::info('Consolidated payment completed successfully', [
                'consolidated_payment_id' => $consolidatedPayment->id
            ]);

            return $consolidatedPayment;
        });
    }

    /**
     * Calculate payment status based on amounts
     */
    private function calculatePaymentStatus($grandTotal, $paidAmount)
    {
        $grandTotal = floatval($grandTotal);
        $paidAmount = floatval($paidAmount);

        if ($paidAmount <= 0) {
            return 2; // Unpaid
        } elseif ($paidAmount >= $grandTotal) {
            return 1; // Paid
        } else {
            return 3; // Partial
        }
    }

}
