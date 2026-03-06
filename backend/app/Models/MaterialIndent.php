<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialIndent extends Model
{
    protected $fillable = [
        'indent_no',
        'request_date',
        'department',
        'priority',
        'requested_by',
    ];

    public function items()
    {
        return $this->hasMany(MaterialIndentItem::class);
    }
}
