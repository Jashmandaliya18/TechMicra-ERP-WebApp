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
        Schema::create('material_test_samples', function (Blueprint $table) {
            $table->id();
            $table->string('sample_no')->unique();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('goods_receipt_note_id')->nullable()->constrained('goods_receipt_notes');
            $table->string('test_type')->nullable(); // Chemical, Mechanical, Dimensional
            $table->enum('result', ['Pass', 'Fail', 'Pending'])->default('Pending');
            $table->text('remarks')->nullable();
            $table->foreignId('tested_by')->constrained('users');
            $table->date('test_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_test_samples');
    }
};
