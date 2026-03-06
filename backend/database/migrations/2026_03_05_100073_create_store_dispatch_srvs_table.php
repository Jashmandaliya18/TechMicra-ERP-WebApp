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
        Schema::create('store_dispatch_srvs', function (Blueprint $table) {
            $table->id();
            $table->string('srv_no')->unique();
            $table->foreignId('store_master_id')->constrained('store_masters');
            $table->foreignId('product_id')->constrained('products');
            $table->decimal('dispatch_qty', 10, 4);
            $table->date('dispatch_date');
            $table->string('dispatched_to')->nullable();
            $table->foreignId('dispatched_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_dispatch_srvs');
    }
};
