<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseSchedule extends Model
{
    protected $fillable = [
        'purchase_order_id',
        'expected_date',
        'follow_up_status',
        'remarks',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }
}
