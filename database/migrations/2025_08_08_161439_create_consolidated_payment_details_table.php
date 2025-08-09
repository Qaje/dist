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
        Schema::create('consolidated_payment_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('consolidated_payment_id');
            $table->unsignedBigInteger('sale_id');
            $table->decimal('amount', 15, 2);
            $table->timestamps();

            // Índices
            $table->index('consolidated_payment_id');
            $table->index('sale_id');

            // Claves foráneas
            $table->foreign('consolidated_payment_id')
                  ->references('id')
                  ->on('consolidated_payments')
                  ->onDelete('cascade');

            $table->foreign('sale_id')
                  ->references('id')
                  ->on('sales')
                  ->onDelete('cascade');

            // Evitar duplicados
            //$table->unique(['consolidated_payment_id', 'sale_id']);
            $table->unique(['consolidated_payment_id', 'sale_id'], 'cpd_unique_payment_sale');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consolidated_payment_details');
    }
};
