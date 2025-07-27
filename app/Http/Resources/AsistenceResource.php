<?php

namespace App\Http\Resources;

/**
 * Class AsistenceResource
 */
class AsistenceResource extends BaseJsonResource
{
    public function toArray($request): array
    {
        return [
            'type' => 'asistences',
            'id' => $this->id,
            'attributes' => [
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
                'is_active' => $this->is_active,
                'category' => $this->asistenceCategory ? [
                    'id' => $this->asistenceCategory->id,
                    'name' => $this->asistenceCategory->name,
                ] : null,
                'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
                'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
            ],
        ];
    }
}
