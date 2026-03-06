<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('journal_no')->nullable();
            $table->date('date');
            $table->string('debit_account')->nullable();
            $table->string('credit_account')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->text('narration')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_vouchers');
    }
};
