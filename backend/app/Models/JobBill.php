<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobBill extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_no',
        'job_order_ref',
        'labor_charges',
        'gst',
        'total_amount',
    ];
}
