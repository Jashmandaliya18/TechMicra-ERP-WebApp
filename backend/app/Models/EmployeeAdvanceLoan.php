<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeAdvanceLoan extends Model
{
    protected $fillable = [
        'memo_no',
        'employee_id',
        'loan_date',
        'amount',
        'installments_months',
        'deduction_per_month',
        'remaining_amount',
        'purpose',
        'recovery_month',
        'remarks'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
