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
     */
    public function store(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Validar datos básicos de la venta
            $validator = Validator::make($request->all(), [
                'sale_items' => 'required|array|min:1',
                'sale_items.*.product_id' => 'nullable|exists:products,id',
                'sale_items.*.asistence_id' => 'nullable|exists:asistences,id',
                'sale_items.*.quantity' => 'required|numeric|min:0.01',
                'sale_items.*.price' => 'nullable|numeric|min:0',
                'customer_id' => 'nullable|exists:customers,id',
                'warehouse_id' => 'required|exists:warehouses,id',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation Error.', $validator->errors(), 422);
            }

            // Verificar que cada item tenga product_id O assistance_id (no ambos, no ninguno)
            $saleItems = $request->input('sale_items', []);
            foreach ($saleItems as $index => $item) {
                $hasProduct = isset($item['product_id']) && !empty($item['product_id']);
                $hasAsistence = isset($item['asistence_id']) && !empty($item['asistence_id']);

                if (!$hasProduct && !$hasAsistence) {
                    return $this->sendError(
                        'Validation Error.',
                        ["sale_items.{$index}" => "Cada item debe tener product_id o asistence_id"],
                        422
                    );
                }

                if ($hasProduct && $hasAsistence) {
                    return $this->sendError(
                        'Validation Error.',
                        ["sale_items.{$index}" => "Un item no puede ser producto y asistencia al mismo tiempo"],
                        422
                    );
                }
            }

            // Verificar si existe hold para eliminar
            if (isset($request->hold_ref_no)) {
                $holdExist = Hold::whereReferenceCode($request->hold_ref_no)->first();
                if (!empty($holdExist)) {
                    $holdExist->delete();
                }
            }

            // Crear la venta principal
            $saleData = $request->except('sale_items');
            $sale = $this->saleRepository->storeSale($saleData);

            // Procesar cada item de la venta
            foreach ($saleItems as $item) {
                $this->processSaleItem($sale->id, $item);
            }

            DB::commit();

            // Cargar la venta con sus relaciones
            $sale = $sale->load('saleItems.product', 'saleItems.asistence', 'customer', 'warehouse');

            return $this->sendResponse(new SaleResource($sale), 'Sale created successfully');

        } catch (Exception $e) {
            DB::rollBack();
            return $this->sendError('Error creating sale: ' . $e->getMessage(), [], 500);
        }
    }

    /**
     * Process individual sale item (product or assistance)
     */
    private function processSaleItem(int $saleId, array $item): SaleItem
    {
        $saleItemData = [
            'sale_id' => $saleId,
            'quantity' => $item['quantity'],
        ];

        if (isset($item['product_id']) && !empty($item['product_id'])) {
            // Es un producto
            $product = Product::findOrFail($item['product_id']);

            $saleItemData['product_id'] = $item['product_id'];
            $saleItemData['product_price'] = $product->product_price ?? 0;

            // Usar precio custom si se proporciona, sino usar precio del producto
            $saleItemData['price'] = $item['price'] ?? $product->product_price ?? 0;

        } elseif (isset($item['asistence_id']) && !empty($item['asistence_id'])) {
            // Es una asistencia
            $asistence = Asistence::findOrFail($item['asistence_id']);

            $saleItemData['asistence_id'] = $item['asistence_id'];

            // Usar precio custom si se proporciona, sino usar precio de la asistencia
            $saleItemData['price'] = $item['price'] ?? $asistence->asistence_price ?? 0;
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
            $discountAmount = $saleItemData['discount_amount'] ?? 0;
            $taxAmount = $saleItemData['tax_amount'] ?? 0;

            $saleItemData['sub_total'] = ($price * $quantity) - $discountAmount + $taxAmount;
        }

        return SaleItem::create($saleItemData);
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
