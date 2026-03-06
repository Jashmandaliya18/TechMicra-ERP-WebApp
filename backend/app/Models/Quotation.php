<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    protected $fillable = [
        'quote_id', 'inquiry_id', 'valid_until', 'payment_terms',
    ];

    public function inquiry()
    {
        return $this->belongsTo(Inquiry::class);
    }

    public function items()
    {
        return $this->hasMany(QuotationItem::class);
    }
}
