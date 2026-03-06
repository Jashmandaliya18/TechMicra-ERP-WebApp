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
        Schema::create('material_indent_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_indent_id')->constrained('material_indents')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products'); // Item Name
            $table->integer('current_stock')->default(0);
            $table->integer('requested_qty');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_indent_items');
    }
};
