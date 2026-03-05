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
            $table->foreignId('vendor_id')->constrained('vendors');
            $table->foreignId('purchase_billbook_id')->nullable()->constrained('purchase_billbooks');
            $table->decimal('amount_paid', 15, 2);
            $table->string('payment_mode'); // Bank Transfer, Crypto, Cash
            $table->decimal('tds_percent', 5, 2)->default(0);
            $table->text('remarks')->nullable();
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
