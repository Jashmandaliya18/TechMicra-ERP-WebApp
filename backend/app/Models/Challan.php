<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Challan extends Model
{
    use HasFactory;

    protected $fillable = [
        'challan_no',
        'job_order_ref',
        'item',
        'qty',
        'vehicle_no',
    ];
}
