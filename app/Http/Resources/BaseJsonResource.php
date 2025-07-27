<?php
//
//namespace App\Http\Resources;
//
//use App\Models\Contracts\JsonResourceful;
//use Illuminate\Http\Resources\Json\JsonResource;
//use Illuminate\Pagination\LengthAwarePaginator;
//use Illuminate\Database\Eloquent\Collection;
//
//abstract class BaseJsonResource extends JsonResource
//{
//    // DO NOT REMOVE: This is declared is with a purpose for auto-completion of the fields
//    private static $usedWithCollection;
//
//    /** @var \Eloquent|JsonResourceful */
//    public $resource;
//
//    public static function usingWithCollection()
//    {
//        self::$usedWithCollection = true;
//    }
//
//    public static function notUsingWithCollection()
//    {
//        static::$usedWithCollection = null;
//    }
//
//    public function toArray($request): array
//    {
//        if (self::$usedWithCollection) {
//            // Si se usa con colección, procesamos los items individualmente
//            return $this->processResourceForCollection();
//        }
//
//        $response = [
//            'data' => $this->processResourceForCollection(),
//        ];
//
//        if (is_null(self::$usedWithCollection)) {
//            if (!empty($included = $this->prepareIncludedIfExists())) {
//                $response['included'] = $included;
//            }
//        }
//
//        return $response;
//    }
//
//    private function processResourceForCollection()
//    {
//        // Si es una colección paginada
//        if ($this->resource instanceof LengthAwarePaginator) {
//            return $this->resource->getCollection()->map(function ($item) {
//                return $this->processIndividualResource($item);
//            });
//        }
//
//        // Si es una colección normal
//        if ($this->resource instanceof Collection) {
//            return $this->resource->map(function ($item) {
//                return $this->processIndividualResource($item);
//            });
//        }
//
//        // Si es un item individual
//        return $this->processIndividualResource($this->resource);
//    }
//
//    private function processIndividualResource($item)
//    {
//        // Si el item tiene el método asJsonResourceWithRelationships
//        if (method_exists($item, 'asJsonResourceWithRelationships')) {
//            return $item->asJsonResourceWithRelationships();
//        }
//
//        // Si es un modelo, convertirlo a array
//        if (method_exists($item, 'toArray')) {
//            return $item->toArray();
//        }
//
//        // Como último recurso, retornar el item tal como está
//        return $item;
//    }
//
//    private function prepareIncludedIfExists()
//    {
//        if (method_exists($this->resource, 'prepareIncluded')) {
//            return $this->resource->prepareIncluded();
//        }
//
//        return [];
//    }
//
//    public function asJsonResourceWithRelationships()
//    {
//        // Si no necesitas relaciones, simplemente retorna $this
//        return $this;
//    }
//}


namespace App\Http\Resources;

use App\Models\Contracts\JsonResourceful;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseJsonResource extends JsonResource
{
    // DO NOT REMOVE: This is declared is with a purpose for auto-completion of the fields
    private static $usedWithCollection;

    /** @var \Eloquent|JsonResourceful */
    public $resource;

    public static function usingWithCollection()
    {
        self::$usedWithCollection = true;
    }

    public static function notUsingWithCollection()
    {
        static::$usedWithCollection = null;
    }

    public function toArray($request): array
    {
        if (self::$usedWithCollection) {
            return $this->resource->asJsonResourceWithRelationships();
        }

        $response = [
            'data' => $this->resource->asJsonResourceWithRelationships(),
        ];

        if (is_null(self::$usedWithCollection)) {
            if (! empty($included = $this->resource->prepareIncluded())) {
                $response['included'] = $included;
            }
        }

        return $response;
    }

    public function asJsonResourceWithRelationships()
    {
    // Si no necesitas relaciones, simplemente retorna $this
    return $this;
    }
}
