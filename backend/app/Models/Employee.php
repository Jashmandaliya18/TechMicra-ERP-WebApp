<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'employee_code',
        'name',
        'department',
        'designation',
        'mobile',
        'date_of_joining',
        'basic_salary',
        'bank_details',
        'status',
        'user_id'
    ];

    public function salaryStructure()
    {
        return $this->hasOne(SalaryStructure::class);
    }

    public function payrollRecords()
    {
        return $this->hasMany(MonthlySalarySheet::class);
    }

    public function advanceRecords()
    {
        return $this->hasMany(EmployeeAdvanceLoan::class);
    }
}
