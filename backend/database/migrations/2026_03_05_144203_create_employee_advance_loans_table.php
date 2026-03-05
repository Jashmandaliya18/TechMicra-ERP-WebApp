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
        Schema::create('employee_advance_loans', function (Blueprint $table) {
            $table->id();
            $table->string('memo_no')->unique();
            $table->foreignId('employee_id')->constrained('employees');
            $table->date('loan_date');
            $table->decimal('amount', 15, 2);
            $table->integer('installments_months')->default(1);
            $table->decimal('deduction_per_month', 15, 2);
            $table->decimal('remaining_amount', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_advance_loans');
    }
};
