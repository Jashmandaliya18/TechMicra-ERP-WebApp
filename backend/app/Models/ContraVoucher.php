<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContraVoucher extends Model
{
    protected $fillable = ['date','from_account','to_account','amount','remarks'];
}
