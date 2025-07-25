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
        // Schema::create('asistence_categories', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('tenant_id')->nullable();
        //     $table->string('name');
        //     $table->string('code')->unique();
        //     $table->text('description')->nullable();
        //     $table->string('color')->nullable(); // para UI: color hex para identificar visualmente la categoría
        //     $table->string('icon')->nullable(); // nombre del icono para UI
        //     $table->boolean('is_active')->default(true);
        //     $table->integer('sort_order')->default(0); // orden de visualización
        //     $table->timestamps();

        //     $table->foreign('tenant_id')
        //         ->references('id')->on('tenants')
        //         ->onUpdate('cascade')
        //         ->onDelete('cascade');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('asistence_categories');
    }
};
