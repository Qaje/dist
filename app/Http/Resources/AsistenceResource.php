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
                'image_path'=>$this->image_path,
                'image_url' => $this->getCorrectImageUrl(), // Nueva función
                'order_tax' => $this->order_tax,
                'tax_type' => $this->tax_type,
                'description' => $this->description,
                'notes' => $this->notes,
                'is_active' => $this->is_active,
                'sale_unit' => $this->sale_unit,
                'sale_unit_name' => $this->saleUnit?->name,
                'category' => $this->asistenceCategory ? [
                    'id' => $this->asistenceCategory->id,
                    'name' => $this->asistenceCategory->name,
                ] : null,
                'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
                'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
            ],
        ];
    }

    private function getCorrectImageUrl()
    {
        if (!$this->image_path) {
            return null;
        }

        // Limpiar el path
        $cleanPath = ltrim($this->image_path, '/');

        // Asegurar que incluya la ruta completa
        if (strpos($cleanPath, 'services/images/') === false) {
            $cleanPath = 'services/images/' . $cleanPath;
        }

        return url($cleanPath);
    }
}
