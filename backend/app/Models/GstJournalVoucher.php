<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GstJournalVoucher extends Model
{
    protected $fillable = ['date','gst_ledger','adjustment_type','amount','remarks'];
}
