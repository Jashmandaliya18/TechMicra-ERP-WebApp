<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('warehouse_receipts', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_id')->unique();
            $table->string('source_doc_ref')->nullable(); // Can be PO, Transfer, SRV ref
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('qty_received');
            $table->date('receipt_date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('warehouse_receipts');
    }
};
