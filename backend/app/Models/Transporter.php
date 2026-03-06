<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transporter extends Model
{
    protected $fillable = [
        'name',
        'contact_person',
        'phone',
        'email',
        'address',
        'gst_no',
        'vehicle_types',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function bookings()
    {
        return $this->hasMany(LogisticsBooking::class);
    }

    public function freightBillbooks()
    {
        return $this->hasMany(FreightBillbook::class);
    }
}
