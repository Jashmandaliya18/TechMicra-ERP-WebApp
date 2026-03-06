<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gst_journal_vouchers', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('gst_ledger')->nullable(); // input / output
            $table->string('adjustment_type')->nullable(); // reversal / adjustment
            $table->decimal('amount', 15, 2)->default(0);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gst_journal_vouchers');
    }
};
