<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsolidatedPayment extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'total_amount',
        'payment_date',
        'payment_type',
        'reference',
        'notes'
    ];

    protected $casts = [
        'payment_date' => 'date',
        'total_amount' => 'decimal:2'
    ];

    /**
     * Relación con el cliente
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Relación con los detalles del pago consolidado
     */
    public function details()
    {
        return $this->hasMany(ConsolidatedPaymentDetail::class);
    }

    /**
     * Obtener todas las ventas relacionadas através de los detalles
     */
    public function sales()
    {
        return $this->hasManyThrough(
            Sale::class,
            ConsolidatedPaymentDetail::class,
            'consolidated_payment_id',
            'id',
            'id',
            'sale_id'
        );
    }

    /**
     * Scope para filtrar por rango de fechas
     */
    public function scopeDateRange($query, $from, $to)
    {
        return $query->whereBetween('payment_date', [$from, $to]);
    }

    /**
     * Scope para filtrar por cliente
     */
    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    /**
     * Accessor para obtener el nombre del tipo de pago
     */
    public function getPaymentTypeNameAttribute()
    {
        $paymentTypes = [
            1 => 'Efectivo',
            2 => 'Tarjeta de Crédito',
            3 => 'Tarjeta de Débito',
            4 => 'Transferencia',
            5 => 'Cheque',
            6 => 'Otros'
        ];

        return $paymentTypes[$this->payment_type] ?? 'Desconocido';
    }
}
