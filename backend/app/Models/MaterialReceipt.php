<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialReceipt extends Model
{
    protected $fillable = [
        'receipt_id',
        'goods_receipt_note_id',
        'storage_location',
        'batch_no',
    ];

    public function goodsReceiptNote()
    {
        return $this->belongsTo(GoodsReceiptNote::class);
    }
}
