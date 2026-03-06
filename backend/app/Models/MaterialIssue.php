<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialIssue extends Model
{
    use HasFactory;

    protected $fillable = [
        'issue_id',
        'route_card_ref',
        'item',
        'qty_requested',
        'qty_issued',
        'issued_date',
    ];
}
