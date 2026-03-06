<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credit_card_statements', function (Blueprint $table) {
            $table->id();
            $table->string('card_no')->nullable();
            $table->string('statement_month')->nullable();
            $table->date('transaction_date')->nullable();
            $table->string('merchant')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('expense_head')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_card_statements');
    }
};
