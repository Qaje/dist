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
        Schema::table('sale_items', function (Blueprint $table) {
            // Hacer product_id nullable para permitir asistencias
            $table->unsignedBigInteger('product_id')->nullable()->change();

            // Agregar campo para asistencias
            $table->unsignedBigInteger('asistence_id')->nullable()->after('product_id');
            $table->foreign('asistence_id')->references('id')
                ->on('asistences')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // Agregar campo price como precio principal
            $table->double('price')->nullable()->after('product_price');

            // Hacer sale_unit nullable
            $table->integer('sale_unit')->nullable()->change();

            // Hacer campos de tax y discount nullable si no lo están
            $table->integer('tax_type')->nullable()->change();
            $table->integer('discount_type')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            // Eliminar foreign key y columna de asistencia
            $table->dropForeign(['asistence_id']);
            $table->dropColumn('asistence_id');

            // Eliminar campo price
            $table->dropColumn('price');
        });
    }
};
