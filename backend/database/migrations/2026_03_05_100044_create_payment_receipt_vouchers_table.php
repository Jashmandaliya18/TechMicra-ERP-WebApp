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
            $table->string('voucher_no')->unique();
            $table->date('voucher_date');
            $table->enum('type', ['Payment', 'Receipt']);
            $table->foreignId('ledger_account_id')->constrained('ledger_accounts'); // The party or expense
            $table->decimal('amount', 15, 2);
            $table->string('payment_mode'); // Cash, Bank Transfer, Cheque
            $table->string('reference_no')->nullable(); // Cheque No, UTR
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
