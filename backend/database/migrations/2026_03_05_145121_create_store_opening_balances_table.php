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
        Schema::create('store_opening_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_master_id')->constrained('store_masters');
            $table->foreignId('product_id')->constrained('products');
            $table->decimal('opening_qty', 10, 4)->default(0);
            $table->decimal('opening_value', 15, 2)->default(0);
            $table->date('as_of_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_opening_balances');
    }
};
