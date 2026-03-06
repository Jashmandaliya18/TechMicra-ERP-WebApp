<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalaryStructure extends Model
{
    protected $fillable = [
        'employee_id',
        'effective_date',
        'basic',
        'hra',
        'da',
        'pf_percentage',
        'other_allowances'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
