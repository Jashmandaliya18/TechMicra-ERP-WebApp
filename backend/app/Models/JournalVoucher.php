<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalVoucher extends Model
{
    protected $fillable = ['journal_no','date','debit_account','credit_account','amount','narration'];
}
