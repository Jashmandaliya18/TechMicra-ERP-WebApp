<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name', 'contact_person', 'email', 'mobile',
        'billing_address', 'shipping_address', 'gst_no', 'credit_period_days',
    ];

    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }

    public function saleOrders()
    {
        return $this->hasMany(SaleOrder::class);
    }
}
