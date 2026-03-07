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
        Schema::create('payment_receipt_vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_no')->nullable();
            $table->string('voucher_type')->default('payment'); // payment / receipt
            $table->date('date')->nullable();
            $table->string('party_name')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('mode')->nullable(); // cash / bank / cheque / online
            $table->string('reference_no')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_receipt_vouchers');
    }
};
