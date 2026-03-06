<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentReceiptVoucher extends Model
{
    protected $fillable = ['voucher_type','date','party_name','amount','mode','reference_no','remarks'];
}
