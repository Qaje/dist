<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
               Schema::table('sales', function (Blueprint $table) {
            // Agregar índices para mejorar rendimiento en consultas consolidadas
            if (!Schema::hasIndex('sales', ['customer_id', 'payment_status'])) {
                $table->index(['customer_id', 'payment_status']);
            }

            if (!Schema::hasIndex('sales', ['warehouse_id', 'payment_status'])) {
                $table->index(['warehouse_id', 'payment_status']);
            }

            if (!Schema::hasIndex('sales', ['created_at'])) {
                $table->index(['created_at']);
            }
        });

        // Schema::table('payments', function (Blueprint $table) {
        //     // Índice para mejorar consultas de pagos por venta
        //     if (!Schema::hasIndex('payments', ['sale_id', 'payment_date'])) {
        //         $table->index(['sale_id', 'payment_date']);
        //     }
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex(['customer_id', 'payment_status']);
            $table->dropIndex(['warehouse_id', 'payment_status']);
            $table->dropIndex(['created_at']);
        });

        // Schema::table('payments', function (Blueprint $table) {
        //     $table->dropIndex(['sale_id', 'payment_date']);
        // });
    }
};
