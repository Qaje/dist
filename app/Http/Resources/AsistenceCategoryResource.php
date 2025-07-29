<?php

namespace App\Http\Resources;

/**
 * Class AsistenceCategoryResource
 */
class AsistenceCategoryResource extends BaseJsonResource
{
     public function toArray($request):array
     {
         return [
             'type' => 'asistence_categories',
             'id' => $this->id,
             'attributes' => [
                'name' => $this->name,
                'description' => $this->description, 'is_active' => $this->is_active,
                'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
                'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
             ],
         ];
     }
}
