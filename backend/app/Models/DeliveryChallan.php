<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryChallan extends Model
{
    protected $fillable = [
        'challan_no',
        'challan_date',
        'logistics_booking_id',
        'customer_id',
        'delivery_address',
    ];

    public function booking()
    {
        return $this->belongsTo(LogisticsBooking::class, 'logistics_booking_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(DeliveryChallanItem::class);
    }
}
