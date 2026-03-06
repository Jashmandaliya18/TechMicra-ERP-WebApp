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
        Schema::create('voucher_payments', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_no')->unique();
            $table->string('vendor');
            $table->foreignId('vendor_id')->nullable()->constrained('vendors');
            $table->foreignId('billbook_id')->constrained('purchase_billbooks');
            $table->date('payment_date')->nullable();
            $table->string('bank_account')->nullable();
            $table->decimal('amount', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voucher_payments');
    }
};
