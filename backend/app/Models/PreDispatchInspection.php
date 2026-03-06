<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreDispatchInspection extends Model
{
    protected $fillable = [
        'pdi_no',
        'sale_order_id',
        'product_id',
        'inspected_qty',
        'passed_qty',
        'failed_qty',
        'box_no',
        'packaging_condition',
        'label_accuracy',
        'result',
        'inspected_by',
        'inspection_date',
        'remarks',
    ];

    public function saleOrder()
    {
        return $this->belongsTo(SaleOrder::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'inspected_by');
    }
}
