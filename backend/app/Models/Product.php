<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name', 'sku', 'price', 'unit_price', 'description', 'current_stock', 'blocked_stock',
    ];

    protected $appends = ['net_available'];

    public function getNetAvailableAttribute(): int
    {
        return max(0, ($this->current_stock ?? 0) - ($this->blocked_stock ?? 0));
    }

    public function inquiryItems()
    {
        return $this->hasMany(InquiryItem::class);
    }

    public function quotationItems()
    {
        return $this->hasMany(QuotationItem::class);
    }
}
