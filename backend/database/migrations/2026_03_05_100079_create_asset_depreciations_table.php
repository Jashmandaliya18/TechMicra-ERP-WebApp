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
        Schema::create('asset_depreciations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_master_id')->constrained('asset_masters');
            $table->string('financial_year'); // e.g., 2025-26
            $table->decimal('depreciation_rate', 5, 2); // e.g., 15.00%
            $table->decimal('depreciation_amount', 15, 2);
            $table->decimal('written_down_value', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_depreciations');
    }
};
