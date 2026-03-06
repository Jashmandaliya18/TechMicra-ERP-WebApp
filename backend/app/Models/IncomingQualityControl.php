<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncomingQualityControl extends Model
{
    protected $fillable = [
        'goods_receipt_note_id',
        'product_id',
        'total_qty',
        'sample_size',
        'accepted_qty',
        'rejected_qty',
    ];

    public function goodsReceiptNote()
    {
        return $this->belongsTo(GoodsReceiptNote::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
