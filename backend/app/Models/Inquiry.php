<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $fillable = [
        'inquiry_no', 'customer_id', 'sales_person_id', 'inquiry_date', 'status',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function salesPerson()
    {
        return $this->belongsTo(User::class, 'sales_person_id');
    }

    public function items()
    {
        return $this->hasMany(InquiryItem::class);
    }

    public function quotations()
    {
        return $this->hasMany(Quotation::class);
    }
}
