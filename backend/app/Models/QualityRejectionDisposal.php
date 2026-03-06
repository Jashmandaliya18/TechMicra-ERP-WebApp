<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QualityRejectionDisposal extends Model
{
    protected $fillable = [
        'qrd_no',
        'product_id',
        'rejected_qty',
        'source',
        'disposal_action',
        'reason',
        'disposed_by',
        'disposal_date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'disposed_by');
    }
}
