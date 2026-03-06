<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditCardStatement extends Model
{
    protected $fillable = ['card_no','statement_month','transaction_date','merchant','amount','expense_head','remarks'];
}
