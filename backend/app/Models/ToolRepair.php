<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToolRepair extends Model
{
    protected $fillable = [
        'job_id',
        'tool_id',
        'issue',
        'spares_used',
        'cost',
        'technician',
        'repair_date',
    ];

    public function tool()
    {
        return $this->belongsTo(Tool::class);
    }
}
