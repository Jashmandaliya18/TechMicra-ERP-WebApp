<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarehouseReceipt extends Model
{
    protected $fillable = [
        'receipt_id',
        'source_doc_ref',
        'product_id',
        'qty_received',
        'receipt_date',
        'notes'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
