<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseBillbook extends Model
{
    protected $fillable = [
        'bill_id',
        'purchase_order_id',
        'vendor_invoice_no',
        'invoice_date',
        'taxable_value',
        'gst_amount',
        'total_amount',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function goodsReceiptNote()
    {
        return $this->belongsTo(GoodsReceiptNote::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseBillbookItem::class);
    }
}
