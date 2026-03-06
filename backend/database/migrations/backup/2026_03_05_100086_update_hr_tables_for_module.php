<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Update Employee table to add missing fields
        Schema::table('employees', function (Blueprint $table) {
            if (!Schema::hasColumn('employees', 'mobile')) {
                $table->string('mobile')->nullable()->after('designation');
            }
            if (!Schema::hasColumn('employees', 'bank_details')) {
                $table->text('bank_details')->nullable()->after('basic_salary');
            }
        });

        // 2. Flatten Salary Structures table based on requirements
        // We will drop the old schema and rebuild it flat to match the requested specs.
        Schema::table('salary_structures', function (Blueprint $table) {
            if (Schema::hasColumn('salary_structures', 'salary_head_id')) {
                // Drop foreign key and column from the old schema
                $table->dropForeign(['salary_head_id']);
                $table->dropColumn('salary_head_id');
            }
            if (Schema::hasColumn('salary_structures', 'amount')) {
                $table->dropColumn('amount');
            }
            
            if (!Schema::hasColumn('salary_structures', 'effective_date')) {
                $table->date('effective_date')->nullable();
                $table->decimal('basic', 15, 2)->default(0);
                $table->decimal('hra', 15, 2)->default(0);
                $table->decimal('da', 15, 2)->default(0);
                $table->decimal('pf_percentage', 5, 2)->default(0);
                $table->decimal('other_allowances', 15, 2)->default(0);
            }
        });

        // 3. Update Monthly Salary Sheets (Payroll) to align with requested names
        Schema::table('monthly_salary_sheets', function (Blueprint $table) {
            if (!Schema::hasColumn('monthly_salary_sheets', 'total_days')) {
                $table->integer('total_days')->default(30)->after('year');
            }
            if (!Schema::hasColumn('monthly_salary_sheets', 'present_days')) {
                $table->integer('present_days')->default(30)->after('total_days');
            }
            
            // Renaming Columns - check if they exist first
            if (Schema::hasColumn('monthly_salary_sheets', 'gross_salary')) {
                $table->renameColumn('gross_salary', 'calculated_gross');
            }
            if (Schema::hasColumn('monthly_salary_sheets', 'total_deductions')) {
                $table->renameColumn('total_deductions', 'deductions');
            }
            if (Schema::hasColumn('monthly_salary_sheets', 'net_payable')) {
                $table->renameColumn('net_payable', 'net_pay');
            }
        });

        // 4. Update Employee Advances
        Schema::table('employee_advance_loans', function (Blueprint $table) {
            if (!Schema::hasColumn('employee_advance_loans', 'purpose')) {
                $table->string('purpose')->nullable();
            }
            if (!Schema::hasColumn('employee_advance_loans', 'recovery_month')) {
                $table->string('recovery_month')->nullable();
            }
            if (!Schema::hasColumn('employee_advance_loans', 'remarks')) {
                $table->text('remarks')->nullable();
            }
        });
    }

    public function down(): void
    {
        // Revert Employee Advance Loans
        Schema::table('employee_advance_loans', function (Blueprint $table) {
            $table->dropColumn(['purpose', 'recovery_month', 'remarks']);
        });

        // Revert Monthly Salary Sheets (Payroll)
        Schema::table('monthly_salary_sheets', function (Blueprint $table) {
            $table->dropColumn(['total_days', 'present_days']);
            if (Schema::hasColumn('monthly_salary_sheets', 'calculated_gross')) {
                $table->renameColumn('calculated_gross', 'gross_salary');
            }
            if (Schema::hasColumn('monthly_salary_sheets', 'deductions')) {
                $table->renameColumn('deductions', 'total_deductions');
            }
            if (Schema::hasColumn('monthly_salary_sheets', 'net_pay')) {
                $table->renameColumn('net_pay', 'net_payable');
            }
        });

        // Revert Salary Structures
        Schema::table('salary_structures', function (Blueprint $table) {
            $table->dropColumn(['effective_date', 'basic', 'hra', 'da', 'pf_percentage', 'other_allowances']);
            $table->foreignId('salary_head_id')->constrained('salary_heads');
            $table->decimal('amount', 15, 2);
        });

        // Revert Employee
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['mobile', 'bank_details']);
        });
    }
};
