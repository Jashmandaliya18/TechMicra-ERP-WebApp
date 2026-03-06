<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleOrder extends Model
{
    protected $fillable = [
        'so_no', 'customer_id', 'customer_po_ref', 'billing_address', 'shipping_address', 'status',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(SaleOrderItem::class);
    }

    public function dispatchAdvices()
    {
        return $this->hasMany(DispatchAdvice::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
