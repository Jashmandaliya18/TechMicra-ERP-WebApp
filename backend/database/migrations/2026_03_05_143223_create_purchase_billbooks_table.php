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
        Schema::create('purchase_billbooks', function (Blueprint $table) {
            $table->id();
            $table->string('bill_id')->unique();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders');
            $table->string('vendor_invoice_no')->nullable();
            $table->date('invoice_date')->nullable();
            $table->decimal('taxable_value', 15, 2)->default(0);
            $table->decimal('gst_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_billbooks');
    }
};
