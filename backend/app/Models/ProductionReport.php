<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'shift',
        'machine_no',
        'operator',
        'production_qty',
        'rejection_qty',
    ];
}
