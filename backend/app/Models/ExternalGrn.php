<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExternalGrn extends Model
{
    use HasFactory;

    protected $fillable = [
        'grn_no',
        'challan_ref',
        'received_qty',
        'passed_qty',
        'rejected_qty',
    ];
}
