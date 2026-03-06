<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlySalarySheet extends Model
{
    protected $fillable = [
        'employee_id',
        'month',
        'year',
        'total_days',
        'present_days',
        'calculated_gross',
        'deductions',
        'net_pay',
        'payment_status'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
