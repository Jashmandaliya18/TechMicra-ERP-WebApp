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
        Schema::create('external_job_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_order_id')->constrained('external_job_orders')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products'); // Material sent
            $table->decimal('sent_qty', 10, 4);
            $table->decimal('expected_return_qty', 10, 4)->nullable(); // Sometimes differs if loss is expected
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('external_job_order_items');
    }
};
