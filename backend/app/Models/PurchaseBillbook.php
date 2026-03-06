<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseBillbook extends Model
{
    protected $fillable = [
        'bill_no',
        'vendor_id',
        'invoice_ref',
        'invoice_date',
        'goods_receipt_note_id',
        'amount',
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
