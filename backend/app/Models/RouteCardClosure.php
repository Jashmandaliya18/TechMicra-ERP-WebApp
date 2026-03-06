<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouteCardClosure extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_card_ref',
        'final_fg_qty',
        'scrap_generated',
        'closure_date',
    ];
}
