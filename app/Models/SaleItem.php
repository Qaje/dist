<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\SaleItem
 *
 * @property int $id
 * @property int $sale_id
 * @property int|null $product_id
 * @property int|null $asistence_id
 * @property float|null $product_price
 * @property float|null $price
 * @property float|null $net_unit_price
 * @property int $tax_type
 * @property float|null $tax_value
 * @property float|null $tax_amount
 * @property int $discount_type
 * @property float|null $discount_value
 * @property float|null $discount_amount
 * @property int $sale_unit
 * @property float|null $quantity
 * @property float|null $sub_total
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Product|null $product
 * @property-read \App\Models\Asistence|null $asistence
 * @property-read \App\Models\Sale $sale
 * @property-read \App\Models\Unit|null $unit
 *
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereDiscountType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereDiscountValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereNetUnitPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereAsistenceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereProductPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereSaleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereSaleUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereSubTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereTaxType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereTaxValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SaleItem whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class SaleItem extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $table = 'sale_items';

    public const JSON_API_TYPE = 'sales_items';

    protected $fillable = [
        'product_id',
        'asistence_id',
        'product_price',
        'price',
        'net_unit_price',
        'tax_type',
        'tax_value',
        'tax_amount',
        'discount_type',
        'discount_value',
        'discount_amount',
        'sale_unit',
        'quantity',
        'sub_total',
    ];

    public static $rules = [
        'product_id' => 'nullable|exists:products,id',
        'asistence_id' => 'nullable|exists:asistences,id',
        'product_price' => 'nullable|numeric',
        'price' => 'nullable|numeric',
        'net_unit_price' => 'nullable|numeric',
        'tax_type' => 'nullable|numeric',
        'tax_value' => 'nullable|numeric',
        'tax_amount' => 'nullable|numeric',
        'discount_type' => 'nullable|numeric',
        'discount_value' => 'nullable|numeric',
        'discount_amount' => 'nullable|numeric',
        'sale_unit' => 'nullable|numeric',
        'quantity' => 'nullable|numeric',
        'sub_total' => 'nullable|numeric',
    ];

    public $casts = [
        'product_price' => 'double',
        'price' => 'double',
        'net_unit_price' => 'double',
        'tax_amount' => 'double',
        'tax_value' => 'double',
        'discount_value' => 'double',
        'discount_amount' => 'double',
        'quantity' => 'double',
        'sub_total' => 'double',
    ];

    // Relación con Unit mejorada
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'sale_unit', 'id');
    }

    // Accessor mejorado para sale_unit
    public function getSaleUnitAttribute($value): array
    {
        if (!$value) {
            return [];
        }

        $saleUnit = $this->unit;
        if ($saleUnit) {
            return $saleUnit->toArray();
        }

        return [];
    }

    // Método para obtener el precio efectivo
    public function getEffectivePriceAttribute(): float
    {
        // Prioridad: price > product_price > precio del producto/asistencia
        if ($this->price !== null) {
            return $this->price;
        }

        if ($this->product_price !== null) {
            return $this->product_price;
        }

        if ($this->product) {
            return $this->product->product_price ?? 0;
        }

        if ($this->asistence) {
            return $this->asistence->asistence_price ?? 0;
        }

        return 0;
    }

    // Método para obtener el nombre del item
    public function getItemNameAttribute(): string
    {
        if ($this->product) {
            return $this->product->name ?? 'Producto sin nombre';
        }

        if ($this->asistence) {
            return $this->asistence->name ?? 'Asistencia sin nombre';
        }

        return 'Item desconocido';
    }

    // Método para verificar si es un producto
    public function isProduct(): bool
    {
        return !is_null($this->product_id);
    }

    // Método para verificar si es una asistencia
    public function isAsistence(): bool
    {
        return !is_null($this->asistence_id);
    }

    public function prepareLinks(): array
    {
        return [];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'product_id' => $this->product_id,
            'asistence_id' => $this->asistence_id,
            'net_unit_price' => $this->net_unit_price,
            'product_price' => $this->product_price,
            'price' => $this->price,
            'effective_price' => $this->effective_price,
            'item_name' => $this->item_name,
            'is_product' => $this->isProduct(),
            'is_asistence' => $this->isAsistence(),
            'tax_type' => $this->tax_type,
            'tax_value' => $this->tax_value,
            'tax_amount' => $this->tax_amount,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'discount_amount' => $this->discount_amount,
            'sale_unit' => $this->sale_unit,
            'quantity' => $this->quantity,
            'sub_total' => $this->sub_total,
        ];

        return $fields;
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class, 'sale_id', 'id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function asistence(): BelongsTo
    {
        return $this->belongsTo(Asistence::class, 'asistence_id', 'id');
    }

    // Scope para obtener solo productos
    public function scopeProducts($query)
    {
        return $query->whereNotNull('product_id');
    }

    // Scope para obtener solo asistencias
    public function scopeAsistences($query)
    {
        return $query->whereNotNull('asistence_id');
    }
}
