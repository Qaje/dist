<?php

namespace App\Http\Resources;

/**
 * Class AsistenceCategoryCollection
 */

use Illuminate\Http\Resources\Json\ResourceCollection;

class AsistenceCategoryCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection,
        ];
    }
}
