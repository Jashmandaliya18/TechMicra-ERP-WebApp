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
        Schema::create('contractor_monthly_salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contractor_employee_id')->constrained('contractor_employees');
            $table->integer('month');
            $table->integer('year');
            $table->integer('days_worked')->default(0);
            $table->decimal('gross_salary', 15, 2)->default(0);
            $table->decimal('total_deductions', 15, 2)->default(0);
            $table->decimal('net_payable', 15, 2)->default(0);
            $table->enum('payment_status', ['Pending', 'Paid'])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contractor_monthly_salaries');
    }
};
