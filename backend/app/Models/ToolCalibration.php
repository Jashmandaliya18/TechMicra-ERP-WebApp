<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToolCalibration extends Model
{
    protected $fillable = [
        'tool_id',
        'calibration_date',
        'standard_value',
        'actual_value',
        'result',
        'remarks',
    ];

    public function tool()
    {
        return $this->belongsTo(Tool::class);
    }
}
