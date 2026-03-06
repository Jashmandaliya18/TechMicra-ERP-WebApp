<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoodsReceiptNoteItem extends Model
{
    protected $fillable = [
        'goods_receipt_note_id',
        'item_name',
        'product_id',
        'received_qty',
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

