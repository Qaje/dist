<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;


class Asistence extends BaseModel implements HasMedia,JsonResourceful
// class Asistence extends AppBaseController
{
    use HasFactory, InteractsWithMedia, HasJsonResourcefulData;

    protected $table = 'asistences';

    const JSON_API_TYPE = 'services';

    public const PATH = 'service';

    protected $fillable = [
        //'tenant_id',
        'name',
        'code',
        'asistence_category_id',
        'asistence_cost',
        'asistence_price',
        'asistence_unit',
        'estimated_duration',
        'order_tax',
        'tax_type',
        'description',
        'notes',
        'sale_unit',
        'is_active',
    ];

    protected $casts = [
        'asistence_cost' => 'float',
        'asistence_price' => 'float',
        'order_tax' => 'float',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(AsistenceCategory::class, 'asistence_category_id');
    }

    // public function tenant()
    // {
    //     return $this->belongsTo(Tenant::class, 'tenant_id', 'id');
    // }

//    public function asistenceCategory()
//    {
//        return $this->belongsTo(\App\Models\AsistenceCategory::class, 'asistence_category_id');
//    }

    public function prepareLinks(): array
    {
        return [
            'self' => route('asistences.show', $this),
            'category' => route('asistence-categories.show', $this->asistence_category_id),
            //'tenant' => route('tenants.show', $this->tenant_id),
        ];
    }

    public function prepareAttributes(): array
    {
        //$this->load('category', 'tenant');
        $this->load('category');

        $fields = [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'asistence_category_id' => $this->asistence_category_id,
            'asistence_cost' => $this->asistence_cost,
            'asistence_price' => $this->asistence_price,
            'asistence_unit' => $this->asistence_unit,
            'estimated_duration' => $this->estimated_duration,
            'order_tax' => $this->order_tax,
            'tax_type' => $this->tax_type,
            'description' => $this->description,
            'notes' => $this->notes,
            'sale_unit' => $this->sale_unit,
            'is_active' => $this->is_active,
        ];

        if( $this->relationLoaded('category')) {
            $fields['category'] = $this->category->prepareAttributes();
        }

        if( $this->relationLoaded('saleUnit') && $this->saleUnit) {
            $fields['sale_unit_info'] = [
                'id' => $this->saleUnit->id,
                'name' => $this->saleUnit->name,
                'short_name' => $this->saleUnit->short_name,
            ];
        }

        return $fields;
    }

    public static function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:100',
            'asistence_category_id' => 'required|exists:asistence_categories,id',
            'asistence_cost' => 'nullable|numeric|min:0',
            'asistence_price' => 'nullable|numeric|min:0',
            'asistence_unit' => 'nullable|string|max:50',
            'estimated_duration' => 'nullable|integer|min:0',
            'order_tax' => 'nullable|numeric|min:0',
            'tax_type' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
            'sale_unit' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ];
    }
}
