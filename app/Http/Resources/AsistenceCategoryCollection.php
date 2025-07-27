<?php

namespace App\Http\Resources;

class AsistenceCategoryCollection extends BaseCollection
{
    public $collects = AsistenceCategoryResource::class;

    // /**
    //  * The resource that this resource collects.
    //  *
    //  * @var string
    //  */
    // public $collects = AsistenceCategoryResource::class;

    // /**
    //  * Transform the resource collection into an array.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
    //  */
    // public function toArray($request)
    // {
    //     return [
    //         'data' => $this->collection,
    //         'meta' => [
    //             'total' => $this->total(),
    //             'per_page' => $this->perPage(),
    //             'current_page' => $this->currentPage(),
    //             'last_page' => $this->lastPage(),
    //             'from' => $this->firstItem(),
    //             'to' => $this->lastItem(),
    //         ],
    //         'links' => [
    //             'first' => $this->url(1),
    //             'last' => $this->url($this->lastPage()),
    //             'prev' => $this->previousPageUrl(),
    //             'next' => $this->nextPageUrl(),
    //         ],
    //     ];
    // }
}
