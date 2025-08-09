<?php

namespace App\Repositories;

use App\Models\ConsolidatedPayment;
use App\Models\Sale;
use Carbon\Carbon;

class ConsolidatedReportRepository
{
    /**
     * Generar resumen de pagos consolidados
     */
    public function generateSummaryReport($filters = [])
    {
        $query = ConsolidatedPayment::with(['customer', 'details.sale']);

        // Aplicar filtros
        if (isset($filters['date_from'])) {
            $query->whereDate('payment_date', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->whereDate('payment_date', '<=', $filters['date_to']);
        }

        if (isset($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (isset($filters['warehouse_id'])) {
            $query->whereHas('details.sale', function ($q) use ($filters) {
                $q->where('warehouse_id', $filters['warehouse_id']);
            });
        }

        $payments = $query->get();

        return [
            'total_payments' => $payments->count(),
            'total_amount' => $payments->sum('total_amount'),
            'average_payment' => $payments->count() > 0 ? $payments->avg('total_amount') : 0,
            'unique_customers' => $payments->pluck('customer_id')->unique()->count(),
            'total_sales_consolidated' => $payments->sum(function ($p) {
                return $p->details->count();
            }),
            'payments_by_type' => $this->getPaymentsByType($payments),
            'monthly_trend' => $this->getMonthlyTrend($payments)
        ];
    }

    /**
     * Agrupar pagos por tipo
     */
    private function getPaymentsByType($payments)
    {
        return $payments->groupBy('payment_type')->map(function ($typePayments, $type) {
            $typeNames = [
                1 => 'Efectivo',
                2 => 'Tarjeta de Crédito',
                3 => 'Tarjeta de Débito',
                4 => 'Transferencia',
                5 => 'Cheque',
                6 => 'Otros'
            ];

            return [
                'type' => $type,
                'type_name' => $typeNames[$type] ?? 'Desconocido',
                'count' => $typePayments->count(),
                'total_amount' => $typePayments->sum('total_amount')
            ];
        })->values();
    }

    /**
     * Obtener tendencia mensual
     */
    private function getMonthlyTrend($payments)
    {
        return $payments->groupBy(function ($payment) {
            return $payment->payment_date->format('Y-m');
        })->map(function ($monthPayments, $month) {
            return [
                'month' => $month,
                'count' => $monthPayments->count(),
                'total_amount' => $monthPayments->sum('total_amount')
            ];
        })->values();
    }

    /**
     * Generar reporte de clientes con más pagos consolidados
     */
    public function getTopCustomersReport($limit = 10)
    {
        return ConsolidatedPayment::select([
                'customer_id',
                DB::raw('COUNT(*) as payments_count'),
                DB::raw('SUM(total_amount) as total_amount'),
                DB::raw('AVG(total_amount) as average_amount')
            ])
            ->with('customer')
            ->groupBy('customer_id')
            ->orderByDesc('total_amount')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'customer_id' => $item->customer_id,
                    'customer_name' => $item->customer ? $item->customer->name : 'Desconocido',
                    'payments_count' => $item->payments_count,
                    'total_amount' => $item->total_amount,
                    'average_amount' => round($item->average_amount, 2)
                ];
            });
    }
}
