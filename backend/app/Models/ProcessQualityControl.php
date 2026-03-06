<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcessQualityControl extends Model
{
    protected $fillable = [
        'pqc_no',
        'routecard_id',
        'operation_stage',
        'sample_size',
        'accepted_qty',
        'rejected_qty',
        'result',
        'inspected_by',
        'inspection_date',
        'remarks',
    ];

    public function routecard()
    {
        return $this->belongsTo(Routecard::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'inspected_by');
    }
}
