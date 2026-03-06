<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoodsReceiptNote extends Model
{
    protected $fillable = [
        'grn_no',
        'purchase_order_id',
        'vendor_challan_no',
        'gate_entry_date',
        'vehicle_no',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function items()
    {
        return $this->hasMany(GoodsReceiptNoteItem::class);
    }
}
