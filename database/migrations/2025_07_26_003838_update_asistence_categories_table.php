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
        Schema::table('asistence_categories', function (Blueprint $table) {
            // Agregar campos que pueden faltar
            if (!Schema::hasColumn('asistence_categories', 'description')) {
                $table->text('description')->nullable()->after('name');
            }

            if (!Schema::hasColumn('asistence_categories', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('description');
            }

            // Agregar timestamps si no existen
            if (!Schema::hasColumn('asistence_categories', 'created_at')) {
                $table->timestamps();
            }

            // Agregar índices para mejorar performance
            $table->index('is_active');
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asistence_categories', function (Blueprint $table) {
            $table->dropColumn(['description', 'is_active']);
            $table->dropTimestamps();
            $table->dropIndex(['is_active']);
            $table->dropIndex(['name']);
        });
    }
};
