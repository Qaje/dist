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
        Schema::create('asistences', function (Blueprint $table) {
            $table->id();
            //$table->string('tenant_id')->nullable();
            $table->string('name');
            $table->string('code');
            $table->unsignedBigInteger('asistence_category_id');
            $table->foreign('asistence_category_id')->references('id')
                ->on('asistence_categories')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            // $table->foreignId('asistence_category_id')->constrained()->onDelete('cascade');
            $table->double('asistence_cost');
            $table->double('asistence_price');
            $table->string('asistence_unit'); // ej: hora, día, metro cuadrado, etc.
            $table->integer('estimated_duration')->nullable(); // duración estimada en minutos
            $table->double('order_tax')->nullable();
            $table->enum('tax_type', [1, 2])->nullable();
            $table->text('description')->nullable(); // descripción del servicio
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('sale_unit')->nullable();
            $table->timestamps();

            // $table->foreign('tenant_id')
            //     ->references('id')->on('tenants')
            //     ->onUpdate('cascade')
            //     ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistences');
    }
};
