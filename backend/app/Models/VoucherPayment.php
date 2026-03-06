<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VoucherPayment extends Model
{
    protected $fillable = [
        'voucher_no',
        'vendor',
        'vendor_id',
        'billbook_id',
        'payment_date',
        'bank_account',
        'amount',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function purchaseBillbook()
    {
        return $this->belongsTo(PurchaseBillbook::class);
    }
}
