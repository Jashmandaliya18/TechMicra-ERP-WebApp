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
        Schema::create('incoming_quality_controls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('goods_receipt_note_id')->constrained('goods_receipt_notes');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('total_qty');
            $table->integer('sample_size')->default(0);
            $table->integer('accepted_qty')->default(0);
            $table->integer('rejected_qty')->default(0);
            $table->enum('visual_check', ['Pass', 'Fail'])->nullable();
            $table->string('dimension_check')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incoming_quality_controls');
    }
};
