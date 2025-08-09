<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consolidated_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->decimal('total_amount', 15, 2);
            $table->date('payment_date');
            $table->integer('payment_type'); // 1=Efectivo, 2=Tarjeta Crédito, 3=Tarjeta Débito, etc.
            $table->string('reference')->unique();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Índices
            $table->index('customer_id');
            $table->index('payment_date');
            $table->index('payment_type');
            $table->index('reference');

            // Clave foránea
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('consolidated_payments');
    }
};
