<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarehouseOpening extends Model
{
    protected $fillable = [
        'opening_id',
        'warehouse_id',
        'product_id',
        'opening_qty',
        'value',
        'date'
    ];

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
