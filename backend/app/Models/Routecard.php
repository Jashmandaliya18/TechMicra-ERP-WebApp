<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_card_no',
        'batch_no',
        'product',
        'plan_qty',
        'start_date',
        'end_date',
        'status',
    ];
}
