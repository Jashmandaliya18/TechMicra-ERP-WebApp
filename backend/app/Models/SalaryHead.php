<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalaryHead extends Model
{
    protected $fillable = [
        'head_name',
        'type',
        'is_active'
    ];
}
