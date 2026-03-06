<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mta extends Model
{
    use HasFactory;

    protected $fillable = [
        'mta_no',
        'from_department',
        'to_department',
        'item',
        'qty',
        'received_by',
        'transfer_date',
    ];
}
