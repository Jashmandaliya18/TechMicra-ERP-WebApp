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
        Schema::create('logistics_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_no')->unique();
            $table->date('booking_date');
            $table->foreignId('sale_order_id')->nullable()->constrained('sale_orders');
            $table->foreignId('transporter_id')->constrained('transporters');
            $table->decimal('freight_amount', 15, 2)->default(0);
            $table->decimal('advance_paid', 15, 2)->default(0);
            $table->enum('status', ['Booked', 'In-Transit', 'Delivered'])->default('Booked');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logistics_bookings');
    }
};
