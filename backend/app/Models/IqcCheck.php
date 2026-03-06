<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IqcCheck extends Model
{
    protected $table = 'iqc_checks';

    protected $fillable = [
        'goods_receipt_note_id',
        'item_name',
        'product_id',
        'total_qty',
        'sample_size',
        'accepted_qty',
        'rejected_qty',
        'status',
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
