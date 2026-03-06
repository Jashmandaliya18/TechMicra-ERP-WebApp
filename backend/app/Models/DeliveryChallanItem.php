<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryChallanItem extends Model
{
    protected $fillable = [
        'delivery_challan_id',
        'product_id',
        'quantity',
    ];

    public function challan()
    {
        return $this->belongsTo(DeliveryChallan::class, 'delivery_challan_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
