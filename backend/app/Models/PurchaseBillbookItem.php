<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseBillbookItem extends Model
{
    protected $fillable = [
        'purchase_billbook_id',
        'product_id',
        'quantity',
        'rate',
        'amount',
    ];

    public function purchaseBillbook()
    {
        return $this->belongsTo(PurchaseBillbook::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
