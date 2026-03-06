<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DispatchAdvice extends Model
{
    protected $fillable = [
        'dispatch_id', 'sale_order_id', 'transporter_name', 'vehicle_no', 'driver_name',
    ];

    public function saleOrder()
    {
        return $this->belongsTo(SaleOrder::class);
    }
}
