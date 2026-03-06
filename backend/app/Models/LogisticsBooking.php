<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogisticsBooking extends Model
{
    protected $fillable = [
        'booking_no',
        'booking_date',
        'sale_order_id',
        'transporter_id',
        'freight_amount',
        'advance_paid',
        'status',
    ];

    public function transporter()
    {
        return $this->belongsTo(Transporter::class);
    }

    public function saleOrder()
    {
        return $this->belongsTo(SaleOrder::class);
    }

    public function challans()
    {
        return $this->hasMany(DeliveryChallan::class);
    }

    public function freightBillbook()
    {
        return $this->hasOne(FreightBillbook::class);
    }
}
