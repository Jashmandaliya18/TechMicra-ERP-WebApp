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
        Schema::create('dispatch_advice', function (Blueprint $table) {
            $table->id();
            $table->string('dispatch_id')->unique();
            $table->foreignId('sale_order_id')->constrained('sale_orders');
            $table->string('transporter_name')->nullable(); // Will link to Transport Master later
            $table->string('vehicle_no')->nullable();
            $table->string('driver_name')->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dispatch_advice');
    }
};
