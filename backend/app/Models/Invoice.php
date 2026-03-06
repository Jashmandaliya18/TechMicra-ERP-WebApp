<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_no', 'sale_order_id', 'invoice_date', 'place_of_supply',
        'e_way_bill_no', 'taxable_value', 'gst_amount', 'round_off', 'grand_total',
    ];

    public function saleOrder()
    {
        return $this->belongsTo(SaleOrder::class);
    }
}
