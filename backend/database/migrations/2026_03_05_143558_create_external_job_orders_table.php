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
        Schema::create('external_job_orders', function (Blueprint $table) {
            $table->id();
            $table->string('job_order_no')->unique();
            $table->date('order_date');
            $table->foreignId('vendor_id')->constrained('vendors'); // Subcontractor
            $table->string('process_required'); // e.g. Plating, Coating
            $table->enum('status', ['Open', 'Partial', 'Closed'])->default('Open');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('external_job_orders');
    }
};
