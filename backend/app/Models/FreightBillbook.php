<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FreightBillbook extends Model
{
    protected $fillable = [
        'bill_no',
        'transporter_id',
        'logistics_booking_id',
        'total_freight',
        'gst_amount',
        'net_payable',
        'payment_status',
    ];

    public function transporter()
    {
        return $this->belongsTo(Transporter::class);
    }

    public function booking()
    {
        return $this->belongsTo(LogisticsBooking::class, 'logistics_booking_id');
    }
}
