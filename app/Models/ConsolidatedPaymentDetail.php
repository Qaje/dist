<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsolidatedPaymentDetail extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'consolidated_payment_id',
        'sale_id',
        'amount'
    ];

    protected $casts = [
        'amount' => 'decimal:2'
    ];

    /**
     * Relación con el pago consolidado
     */
    public function consolidatedPayment()
    {
        return $this->belongsTo(ConsolidatedPayment::class);
    }

    /**
     * Relación con la venta
     */
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    /**
     * Scope para filtrar por pago consolidado
     */
    public function scopeByConsolidatedPayment($query, $consolidatedPaymentId)
    {
        return $query->where('consolidated_payment_id', $consolidatedPaymentId);
    }

    /**
     * Scope para filtrar por venta
     */
    public function scopeBySale($query, $saleId)
    {
        return $query->where('sale_id', $saleId);
    }
}
