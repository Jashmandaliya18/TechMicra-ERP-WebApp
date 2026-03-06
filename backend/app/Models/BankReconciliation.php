<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankReconciliation extends Model
{
    protected $fillable = ['bank_account','statement_date','system_balance','bank_balance','unreconciled_amount','remarks'];
}
