<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialTransferSlip extends Model
{
    protected $fillable = ['mta_id', 'product_id', 'qty_checked', 'status'];

    public function mta()
    {
        return $this->belongsTo(MaterialTransferAdvice::class, 'mta_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
