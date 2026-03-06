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
        Schema::create('pre_dispatch_inspections', function (Blueprint $table) {
            $table->id();
            $table->string('pdi_no')->unique();
            $table->foreignId('sale_order_id')->constrained('sale_orders');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('inspected_qty');
            $table->integer('passed_qty')->default(0);
            $table->integer('failed_qty')->default(0);
            $table->string('box_no')->nullable();
            $table->enum('packaging_condition', ['OK', 'Damaged'])->default('OK');
            $table->enum('label_accuracy', ['Pass', 'Fail'])->default('Pass');
            $table->enum('result', ['Approved', 'Rejected', 'Conditional'])->default('Approved');
            $table->foreignId('inspected_by')->constrained('users');
            $table->date('inspection_date');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pre_dispatch_inspections');
    }
};
