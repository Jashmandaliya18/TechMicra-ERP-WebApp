<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoodsReceiptNoteItem extends Model
{
    protected $fillable = [
        'goods_receipt_note_id',
        'product_id',
        'received_qty',
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

