<?php

namespace App\Http\Resources;

//use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends BaseJsonResource
{

    // /**
    //  * Transform the resource into an array.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
    //  */
    // public function toArray($request)
    // {
    //     return [
    //         'id' => $this->id,
    //         'reference_code' => $this->reference_code,
    //         'customer_id' => $this->customer_id,
    //         'warehouse_id' => $this->warehouse_id,
    //         'date' => $this->date,
    //         'status' => $this->status,
    //         'payment_status' => $this->payment_status,
    //         'payment_type' => $this->payment_type,
    //         'total_amount' => $this->total_amount,
    //         'tax_amount' => $this->tax_amount,
    //         'discount_amount' => $this->discount_amount,
    //         'shipping_amount' => $this->shipping_amount,
    //         'grand_total' => $this->grand_total,
    //         'notes' => $this->notes,
    //         'created_at' => $this->created_at,
    //         'updated_at' => $this->updated_at,

    //         // Relaciones
    //         'customer' => new CustomerResource($this->whenLoaded('customer')),
    //         'warehouse' => new WarehouseResource($this->whenLoaded('warehouse')),

    //         // Sale Items con soporte para productos y asistencias
    //         'sale_items' => $this->whenLoaded('saleItems', function () {
    //             return $this->saleItems->map(function ($item) {
    //                 $itemData = [
    //                     'id' => $item->id,
    //                     'quantity' => $item->quantity,
    //                     'price' => $item->price,
    //                     'product_price' => $item->product_price,
    //                     'effective_price' => $item->effective_price,
    //                     'net_unit_price' => $item->net_unit_price,
    //                     'tax_type' => $item->tax_type,
    //                     'tax_value' => $item->tax_value,
    //                     'tax_amount' => $item->tax_amount,
    //                     'discount_type' => $item->discount_type,
    //                     'discount_value' => $item->discount_value,
    //                     'discount_amount' => $item->discount_amount,
    //                     'sale_unit' => $item->sale_unit,
    //                     'sub_total' => $item->sub_total,
    //                     'item_name' => $item->item_name,
    //                     'is_product' => $item->isProduct(),
    //                     'is_asistence' => $item->isAsistence(),
    //                 ];

    //                 // Agregar información del producto si existe
    //                 if ($item->product) {
    //                     $itemData['product'] = [
    //                         'id' => $item->product->id,
    //                         'name' => $item->product->name,
    //                         'code' => $item->product->code,
    //                         'product_code' => $item->product->product_code,
    //                         'product_price' => $item->product->product_price,
    //                         'image_url' => $item->product->image_url,
    //                     ];
    //                 }

    //                 // Agregar información de la asistencia si existe
    //                 if ($item->asistence) {
    //                     $itemData['asistence'] = [
    //                         'id' => $item->asistence->id,
    //                         'name' => $item->asistence->name,
    //                         'code' => $item->asistence->code,
    //                         'asistence_price' => $item->asistence->asistence_price,
    //                         'estimated_duration' => $item->asistence->estimated_duration,
    //                         'category' => $item->asistence->category ? [
    //                             'id' => $item->asistence->category->id,
    //                             'name' => $item->asistence->category->name,
    //                         ] : null,
    //                     ];
    //                 }

    //                 return $itemData;
    //             });
    //         }),
    //     ];
    // }
}
