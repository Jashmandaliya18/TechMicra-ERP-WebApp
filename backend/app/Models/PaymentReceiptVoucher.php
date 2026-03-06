<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentReceiptVoucher extends Model
{
    protected $fillable = [
        'voucher_type', 'receipt_no', 'date', 'voucher_date',
        'party_name', 'customer_id', 'invoice_id',
        'amount', 'mode', 'reference_no', 'ref_no', 'remarks',
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
