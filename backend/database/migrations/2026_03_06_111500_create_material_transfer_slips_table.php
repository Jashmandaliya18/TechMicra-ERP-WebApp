<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('material_transfer_slips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mta_id')->constrained('material_transfer_advice');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('qty_checked');
            $table->enum('status', ['OK', 'Damaged'])->default('OK');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_transfer_slips');
    }
};
