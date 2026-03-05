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
        Schema::create('material_transfer_advice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mta_id')->constrained('material_transfer_advice')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products'); // The item being moved
            $table->decimal('transfer_qty', 10, 4);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_transfer_advice_items');
    }
};
