<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Http\Resources\SaleCollection;
use App\Http\Resources\SaleResource;
use App\Models\Customer;
use App\Models\Hold;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Asistence;
use App\Models\Taxe;
use App\Models\Setting;
use App\Models\Warehouse;
use App\Repositories\SaleRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SaleAPIController
 */
class SaleAPIController extends AppBaseController
{
    /** @var saleRepository */
    private $saleRepository;

    public function __construct(SaleRepository $saleRepository)
    {
        $this->saleRepository = $saleRepository;
    }

    public function index(Request $request): SaleCollection
    {
        $perPage = getPageSize($request);
        $search = $request->filter['search'] ?? '';
        $customer = (Customer::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $warehouse = (Warehouse::where('name', 'LIKE', "%$search%")->get()->count() != 0);

        $sales = $this->saleRepository;
        if ($customer || $warehouse) {
            $sales->whereHas('customer', function (Builder $q) use ($search, $customer) {
                if ($customer) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            })->whereHas('warehouse', function (Builder $q) use ($search, $warehouse) {
                if ($warehouse) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            });
        }

        if ($request->get('start_date') && $request->get('end_date')) {
            $sales->whereBetween('date', [$request->get('start_date'), $request->get('end_date')]);
        }

        if ($request->get('warehouse_id')) {
            $sales->where('warehouse_id', $request->get('warehouse_id'));
        }

        if ($request->get('customer_id')) {
            $sales->where('customer_id', $request->get('customer_id'));
        }

        if ($request->get('status') && $request->get('status') != 'null') {
            $sales->Where('status', $request->get('status'));
        }

        if ($request->get('payment_status') && $request->get('payment_status') != 'null') {
            $sales->where('payment_status', $request->get('payment_status'));
        }

        if ($request->get('payment_type') && $request->get('payment_type') != 'null') {
            $sales->where('payment_type', $request->get('payment_type'));
        }

        $sales = $sales->paginate($perPage);

        SaleResource::usingWithCollection();

        return new SaleCollection($sales);
    }

    /**
     * Store a new sale with improved handling of products and assistances
    **/
    public function store(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Debug: Ver qué datos llegan
            \Log::info('Request data:', $request->all());

            // ✅ CORREGIDO: Validar usando 'asistence_id' que es lo que realmente viene del frontend
            $validator = Validator::make($request->all(), [
                'sale_items' => 'required|array|min:1',
                'sale_items.*.product_id' => 'nullable|exists:products,id',
                'sale_items.*.asistence_id' => 'nullable|exists:asistences,id', // Cambiar a asistence_id
                'sale_items.*.quantity' => 'required|numeric|min:0.01',
                'sale_items.*.price' => 'nullable|numeric|min:0',
                'customer_id' => 'nullable|exists:customers,id',
                'warehouse_id' => 'required|exists:warehouses,id',
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Error.',
                    'data' => $validator->errors()
                ], 422);
            }

            // ✅ CORREGIDO: Verificar usando 'assistance_id' consistentemente
            $saleItems = $request->input('sale_items', []);
            \Log::info('Sale items to validate:', $saleItems);

            foreach ($saleItems as $index => $item) {
                \Log::info("Validating item {$index}:", $item);

                $hasProduct = isset($item['product_id']) && !empty($item['product_id']);
                $hasAssistance = isset($item['asistence_id']) && !empty($item['asistence_id']); // ✅ Cambio aquí

                \Log::info("Item {$index} validation:", [
                    'hasProduct' => $hasProduct,
                    'hasAssistance' => $hasAssistance,
                    'product_id' => $item['product_id'] ?? 'not set',
                    'asistence_id' => $item['asistence_id'] ?? 'not set' // ✅ Cambio aquí
                ]);

                if (!$hasProduct && !$hasAssistance) {
                    \Log::error("Item {$index} has no product_id or assistance_id");
                    return response()->json([
                        'success' => false,
                        'message' => 'Validation Error.',
                        'data' => ["sale_items.{$index}" => "Cada item debe tener product_id o asistence_id"]
                    ], 422);
                }

                if ($hasProduct && $hasAssistance) {
                    \Log::error("Item {$index} has both product_id and assistance_id");
                    return response()->json([
                        'success' => false,
                        'message' => 'Validation Error.',
                        'data' => ["sale_items.{$index}" => "Un item no puede ser producto y asistencia al mismo tiempo"]
                    ], 422);
                }
            }

            \Log::info('All validations passed, proceeding with sale creation');

            // ✅ VERIFICAR: Datos obligatorios para crear la venta
            $requiredFields = ['warehouse_id', 'grand_total', 'payment_type', 'payment_status', 'status'];
            foreach ($requiredFields as $field) {
                if (!isset($request->$field)) {
                    \Log::error("Missing required field: {$field}");
                    return response()->json([
                        'success' => false,
                        'message' => "Campo obligatorio faltante: {$field}"
                    ], 422);
                }
            }

            // Verificar si existe hold para eliminar
            if (isset($request->hold_ref_no) && !empty($request->hold_ref_no)) {
                $holdExist = Hold::whereReferenceCode($request->hold_ref_no)->first();
                if (!empty($holdExist)) {
                    $holdExist->delete();
                }
            }

            // ✅ SOLUCIÓN: Separar y mapear productos y asistencias
            $saleItems = $request->input('sale_items', []);
            $productItems = [];
            $assistanceItems = [];

            foreach ($saleItems as $item) {
                if (isset($item['product_id'])) {
                    // Obtener el producto para usar su precio real
                    $product = Product::findOrFail($item['product_id']);

                    // Mapear campos para productos
                    $productItem = $item;
                    $productItem['product_price'] = $product->product_price ?? $item['price']; // Usar precio del producto o el enviado

                    // Agregar campos requeridos por el repositorio si no existen
                    $productItem['net_unit_price'] = $product->product_price ?? $item['price'];
                    $productItem['tax_type'] = $item['tax_type'] ?? 1;
                    $productItem['tax_value'] = $item['tax_value'] ?? 0;
                    $productItem['tax_amount'] = $item['tax_amount'] ?? 0;
                    $productItem['discount_type'] = $item['discount_type'] ?? 1;
                    $productItem['discount_value'] = $item['discount_value'] ?? 0;
                    $productItem['discount_amount'] = $item['discount_amount'] ?? 0;
                    $productItem['sale_unit'] = is_numeric($item['sale_unit'] ?? 0);
                    // $productItem['sale_unit'] = is_numeric($item['sale_unit'] ?? null) ?
                    //     ($item['sale_unit'] ?? 1) : 1; // ✅ Asegurar que sea numérico

                    $productItems[] = $productItem;
                } elseif (isset($item['asistence_id'])) {
                    $assistanceItems[] = $item;
                }
            }

            // Preparar datos para el repositorio (solo productos)
            $saleData = $request->all();
            $saleData['sale_items'] = $productItems; // Solo productos con campos mapeados

            \Log::info('Data being sent to repository:', $saleData);
            \Log::info('Product items count:', ['count' => count($productItems)]);
            \Log::info('Assistance items count:', ['count' => count($assistanceItems)]);

            // Si no hay productos, crear la venta manualmente
            if (empty($productItems)) {
                \Log::info('No products found, creating sale manually');

                $saleInputArray = [
                    'customer_id' => $saleData['customer_id'] ?? null,
                    'warehouse_id' => $saleData['warehouse_id'],
                    'date' => $saleData['date'] ?? date('Y-m-d'),
                    'grand_total' => $saleData['grand_total'],
                    'payment_type' => $saleData['payment_type'],
                    'payment_status' => $saleData['payment_status'],
                    'status' => $saleData['status'],
                    'discount' => $saleData['discount'] ?? 0,
                    'shipping' => $saleData['shipping'] ?? 0,
                    'tax_rate' => $saleData['tax_rate'] ?? 0,
                    'note' => $saleData['note'] ?? '',
                    'user_id' => auth()->id(),
                ];

                $sale = Sale::create($saleInputArray);

                // Generar reference_code
                $reference_code = getSettingValue('sale_code') . '_111' . $sale->id;
                $sale->update(['reference_code' => $reference_code]);

            } else {
                $sale = $this->saleRepository->storeSale($saleData);
            }

            \Log::info('Sale created with ID:', ['sale_id' => $sale->id]);

            // Procesar asistencias manualmente
            foreach ($assistanceItems as $item) {
                \Log::info('Processing assistance item:', $item);
                \Log::info('Sale ID for assistance:', ['sale_id' => $sale->id]);
                $this->processSaleItem($sale->id, $item);
            }

            DB::commit();

            // ✅ CORREGIDO: Cargar con el nombre correcto de la relación
            $sale = $sale->load('saleItems.product', 'saleItems.asistence', 'customer', 'warehouse');

            return $this->sendResponse(new SaleResource($sale), 'Sale created successfully');

        } catch (Exception $e) {
            DB::rollBack();
            \Log::error('Sale creation error:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Error creating sale: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process individual sale item (product or assistance)
     */

    private function processSaleItem(int $saleId, array $item): SaleItem
    {
        // ✅ DEBUG: Verificar parámetros de entrada
        \Log::info('processSaleItem called with:', [
            'saleId' => $saleId,
            'item' => $item
        ]);

        $saleItemData = [
            'sale_id' => $saleId, // ✅ CRÍTICO: Asegurar que sale_id está presente
            'quantity' => $item['quantity'],
        ];

        if (isset($item['product_id']) && !empty($item['product_id'])) {
            // Es un producto
            $product = Product::findOrFail($item['product_id']);

            $saleItemData['product_id'] = $item['product_id'];
            $saleItemData['sale_unit'] = $item['sale_unit'];
            $saleItemData['product_price'] = $product->product_price ?? 0;

            // Usar precio custom si se proporciona, sino usar precio del producto
            $saleItemData['price'] = $item['price'] ?? $product->product_price ?? 0;

        } elseif (isset($item['asistence_id']) && !empty($item['asistence_id'])) {
            // ✅ CORREGIDO: Usar 'asistence_id' que es lo que viene del frontend
            // Es una asistencia
            $asistence = Asistence::findOrFail($item['asistence_id']);

            // ✅ CORREGIDO: Guardar con el nombre correcto de la columna en BD
            $saleItemData['asistence_id'] = $item['asistence_id'];

            // ✅ CORREGIDO: Verificar que el campo de precio exista
            $saleItemData['price'] = $item['price'] ?? ($asistence->price ?? $asistence->asistence_price ?? 0);
        }

        // Agregar otros campos si están presentes
        $optionalFields = [
            'net_unit_price', 'tax_type', 'tax_value', 'tax_amount',
            'discount_type', 'discount_value', 'discount_amount',
            'sale_unit', 'sub_total'
        ];

        foreach ($optionalFields as $field) {
            if (isset($item[$field])) {
                $saleItemData[$field] = $item[$field];
            }
        }

        // Si no se proporciona sub_total, calcularlo
        if (!isset($saleItemData['sub_total'])) {
            $price = $saleItemData['price'] ?? 0;
            $quantity = $saleItemData['quantity'] ?? 0;

            if (isset($item['product_id'])) {
                // Para productos: considerar descuentos e impuestos
                $discountAmount = $saleItemData['discount_amount'] ?? 0;
                $taxAmount = $saleItemData['tax_amount'] ?? 0;
                $saleItemData['sub_total'] = ($price * $quantity) - $discountAmount + $taxAmount;
            } else {
                // Para asistencias: cálculo simple
                $saleItemData['sub_total'] = $price * $quantity;
            }
        }

        // ✅ DEBUG: Verificar datos finales antes de crear
        \Log::info('Final saleItemData before create:', $saleItemData);

        // ✅ VERIFICAR: Que sale_id existe en la tabla sales
        $saleExists = \DB::table('sales')->where('id', $saleId)->exists();
        \Log::info('Sale exists check:', ['sale_id' => $saleId, 'exists' => $saleExists]);

        if (!$saleExists) {
            throw new \Exception("Sale with ID {$saleId} does not exist");
        }

        // ✅ ALTERNATIVA: Crear usando new y save()
        $saleItem = new SaleItem();
        $saleItem->sale_id = $saleId;
        $saleItem->quantity = $saleItemData['quantity'];

        if (isset($saleItemData['product_id'])) {
            $saleItem->product_id = $saleItemData['product_id'];
            $saleItem->product_price = $saleItemData['product_price'] ?? 0;

            // ✅ sale_unit solo para productos
            if (isset($saleItemData['sale_unit'])) {
                $saleItem->sale_unit = $saleItemData['sale_unit'];
            }
        }

        if (isset($saleItemData['asistence_id'])) {
            $saleItem->asistence_id = $saleItemData['asistence_id'];
            // ✅ NO asignar sale_unit para asistencias
        }

        $saleItem->price = $saleItemData['price'];
        $saleItem->sub_total = $saleItemData['sub_total'];

        // ✅ Asignar otros campos opcionales si existen
        $optionalFieldsForAssignment = [
            'net_unit_price', 'tax_type', 'tax_value', 'tax_amount',
            'discount_type', 'discount_value', 'discount_amount'
        ];

        foreach ($optionalFieldsForAssignment as $field) {
            if (isset($saleItemData[$field])) {
                $saleItem->$field = $saleItemData[$field];
            }
        }

        $saleItem->save();

        return $saleItem;
    }




    public function show($id): SaleResource
    {
        $sale = $this->saleRepository->find($id);
        return new SaleResource($sale);
    }

    public function edit(Sale $sale): SaleResource
    {
        $sale = $sale->load('saleItems.product.stocks', 'saleItems.asistence', 'warehouse');
        return new SaleResource($sale);
    }

    public function update(UpdateSaleRequest $request, $id): SaleResource
    {
        $input = $request->all();
        $sale = $this->saleRepository->updateSale($input, $id);
        return new SaleResource($sale);
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $sale = $this->saleRepository->with('saleItems')->where('id', $id)->first();

            if (!$sale) {
                return $this->sendError('Sale not found', [], 404);
            }

            // Restaurar stock solo para productos (no para asistencias)
            foreach ($sale->saleItems as $saleItem) {
                if ($saleItem->product_id) {
                    manageStock($sale->warehouse_id, $saleItem->product_id, $saleItem->quantity);
                }
            }

            // Eliminar archivo de código de barras si existe
            if (File::exists(Storage::path('sales/barcode-' . $sale->reference_code . '.png'))) {
                File::delete(Storage::path('sales/barcode-' . $sale->reference_code . '.png'));
            }

            $this->saleRepository->delete($id);
            DB::commit();

            return $this->sendSuccess('Sale Deleted successfully');

        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig
     */
    public function pdfDownload(Sale $sale): JsonResponse
    {
        ini_set('memory_limit', '-1');
        $sale = $sale->load('customer', 'saleItems.product', 'saleItems.asistence', 'payments');
        $data = [];

        if (Storage::exists('pdf/Sale-' . $sale->reference_code . '.pdf')) {
            Storage::delete('pdf/Sale-' . $sale->reference_code . '.pdf');
        }

        $companyLogo = getStoreLogo();
        $companyLogo = (string) \Image::make($companyLogo)->encode('data-url');
        $taxes = Taxe::where('status', 1)->get();

        $pdf = PDF::loadView('pdf.sale-pdf', compact('sale', 'companyLogo', 'taxes'));
        Storage::disk(config('app.media_disc'))->put('pdf/Sale-' . $sale->reference_code . '.pdf', $pdf->output());
        $data['sale_pdf_url'] = Storage::url('pdf/Sale-' . $sale->reference_code . '.pdf');

        return $this->sendResponse($data, 'pdf retrieved Successfully');
    }

    public function saleInfo(Sale $sale): JsonResponse
    {
        $sale = $sale->load('saleItems.product', 'saleItems.asistence', 'warehouse', 'customer');
        $keyName = [
            'store_email', 'store_name', 'store_phone', 'store_address',
        ];
        $companyInfo = Setting::whereIn('key', $keyName)->pluck('value', 'key')->toArray();
        if(getActiveStoreName()) {
            $companyInfo['store_name'] = getActiveStoreName();
        }
        $sale->company_info = $companyInfo;

        return $this->sendResponse($sale, 'Sale information retrieved successfully');
    }

    public function getSaleProductReport(Request $request): SaleCollection
    {
        $perPage = getPageSize($request);
        $productId = $request->get('product_id');
        $sales = $this->saleRepository->whereHas('saleItems', function ($q) use ($productId) {
            $q->where('product_id', '=', $productId);
        })->with(['saleItems.product', 'saleItems.asistence', 'customer']);

        $sales = $sales->paginate($perPage);

        SaleResource::usingWithCollection();

        return new SaleCollection($sales);
    }
}
