<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToolMaintenance extends Model
{
    protected $fillable = [
        'tool_id',
        'scheduled_date',
        'task_list',
        'status',
    ];

    public function tool()
    {
        return $this->belongsTo(Tool::class);
    }
}
