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
        Schema::create('subcontractor_receipts', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_no')->unique();
            $table->foreignId('job_order_id')->constrained('external_job_orders');
            $table->foreignId('product_id')->constrained('products'); // The finished/plated good received back
            $table->decimal('received_qty', 10, 4);
            $table->decimal('scrap_qty', 10, 4)->default(0);
            $table->date('receipt_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subcontractor_receipts');
    }
};
