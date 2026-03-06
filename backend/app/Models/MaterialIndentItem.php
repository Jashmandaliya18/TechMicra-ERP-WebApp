<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialIndentItem extends Model
{
    protected $fillable = [
        'material_indent_id',
        'product_id',
        'current_stock',
        'requested_qty',
    ];

    public function materialIndent()
    {
        return $this->belongsTo(MaterialIndent::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
