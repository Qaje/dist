<?php


namespace App\Http\Resources;

use App\Models\Contracts\JsonResourceful;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;

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
        // Verificar si el resource es MissingValue
        if ($this->resource instanceof MissingValue) {
            return [];
        }

        if (self::$usedWithCollection) {
            // Verificar si el resource tiene el método antes de llamarlo
            if (method_exists($this->resource, 'asJsonResourceWithRelationships')) {
                return $this->resource->asJsonResourceWithRelationships();
            }

            // Fallback si no tiene el método
            return $this->resourceToArray();
        }

        $resourceData = [];

        // Verificar si el resource tiene el método antes de llamarlo
        if (method_exists($this->resource, 'asJsonResourceWithRelationships')) {
            $resourceData = $this->resource->asJsonResourceWithRelationships();
        } else {
            $resourceData = $this->resourceToArray();
        }

        $response = [
            'data' => $resourceData,
        ];

        if (is_null(self::$usedWithCollection)) {
            $included = [];

            // Verificar si el resource tiene el método prepareIncluded antes de llamarlo
            if (method_exists($this->resource, 'prepareIncluded')) {
                $included = $this->resource->prepareIncluded();
            }

            if (!empty($included)) {
                $response['included'] = $included;
            }
        }

        return $response;
    }

    /**
     * Método helper para convertir el resource a array de forma segura
     */
    private function resourceToArray(): array
    {
        if ($this->resource instanceof MissingValue) {
            return [];
        }

        // Si es un modelo Eloquent
        if (method_exists($this->resource, 'toArray')) {
            return $this->resource->toArray();
        }

        // Si es un array
        if (is_array($this->resource)) {
            return $this->resource;
        }

        // Si es un objeto con propiedades públicas
        if (is_object($this->resource)) {
            return get_object_vars($this->resource);
        }

        // Último recurso: convertir a array usando cast
        return (array)$this->resource;
    }

    public function asJsonResourceWithRelationships()
    {
        // Si no necesitas relaciones, simplemente retorna $this
        return $this;
    }
}

////
////namespace App\Http\Resources;
////
////use App\Models\Contracts\JsonResourceful;
////use Illuminate\Http\Resources\Json\JsonResource;
////use Illuminate\Pagination\LengthAwarePaginator;
////use Illuminate\Database\Eloquent\Collection;
////
////abstract class BaseJsonResource extends JsonResource
////{
////    // DO NOT REMOVE: This is declared is with a purpose for auto-completion of the fields
////    private static $usedWithCollection;
////
////    /** @var \Eloquent|JsonResourceful */
////    public $resource;
////
////    public static function usingWithCollection()
////    {
////        self::$usedWithCollection = true;
////    }
////
////    public static function notUsingWithCollection()
////    {
////        static::$usedWithCollection = null;
////    }
////
////    public function toArray($request): array
////    {
////        if (self::$usedWithCollection) {
////            // Si se usa con colección, procesamos los items individualmente
////            return $this->processResourceForCollection();
////        }
////
////        $response = [
////            'data' => $this->processResourceForCollection(),
////        ];
////
////        if (is_null(self::$usedWithCollection)) {
////            if (!empty($included = $this->prepareIncludedIfExists())) {
////                $response['included'] = $included;
////            }
////        }
////
////        return $response;
////    }
////
////    private function processResourceForCollection()
////    {
////        // Si es una colección paginada
////        if ($this->resource instanceof LengthAwarePaginator) {
////            return $this->resource->getCollection()->map(function ($item) {
////                return $this->processIndividualResource($item);
////            });
////        }
////
////        // Si es una colección normal
////        if ($this->resource instanceof Collection) {
////            return $this->resource->map(function ($item) {
////                return $this->processIndividualResource($item);
////            });
////        }
////
////        // Si es un item individual
////        return $this->processIndividualResource($this->resource);
////    }
////
////    private function processIndividualResource($item)
////    {
////        // Si el item tiene el método asJsonResourceWithRelationships
////        if (method_exists($item, 'asJsonResourceWithRelationships')) {
////            return $item->asJsonResourceWithRelationships();
////        }
////
////        // Si es un modelo, convertirlo a array
////        if (method_exists($item, 'toArray')) {
////            return $item->toArray();
////        }
////
////        // Como último recurso, retornar el item tal como está
////        return $item;
////    }
////
////    private function prepareIncludedIfExists()
////    {
////        if (method_exists($this->resource, 'prepareIncluded')) {
////            return $this->resource->prepareIncluded();
////        }
////
////        return [];
////    }
////
////    public function asJsonResourceWithRelationships()
////    {
////        // Si no necesitas relaciones, simplemente retorna $this
////        return $this;
////    }
////}
//
//
//namespace App\Http\Resources;
//
//use App\Models\Contracts\JsonResourceful;
//use Illuminate\Http\Resources\Json\JsonResource;
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
//            return $this->resource->asJsonResourceWithRelationships();
//        }
//
//        $response = [
//            'data' => $this->resource->asJsonResourceWithRelationships(),
//        ];
//
//        if (is_null(self::$usedWithCollection)) {
//            if (! empty($included = $this->resource->prepareIncluded())) {
//                $response['included'] = $included;
//            }
//        }
//
//        return $response;
//    }
//
//    public function asJsonResourceWithRelationships()
//    {
//    // Si no necesitas relaciones, simplemente retorna $this
//    return $this;
//    }
//}
