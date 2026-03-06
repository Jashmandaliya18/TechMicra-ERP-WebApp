<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentReceiptVoucher extends Model
{
    protected $fillable = [
        'receipt_no', 'voucher_date', 'customer_id', 'invoice_id',
        'amount', 'mode', 'ref_no',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
