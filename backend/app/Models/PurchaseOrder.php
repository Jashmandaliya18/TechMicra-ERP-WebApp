<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'po_no',
        'vendor_id',
        'po_date',
        'valid_until',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
