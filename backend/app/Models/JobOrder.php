<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_order_no',
        'contractor',
        'item_sent',
        'process_required',
        'rate',
    ];
}
