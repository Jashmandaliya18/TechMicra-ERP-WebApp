<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DispatchSrv extends Model
{
    protected $fillable = [
        'srv_no',
        'date',
        'party_name',
        'product_id',
        'qty',
        'return_expected',
        'return_expected_date'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
