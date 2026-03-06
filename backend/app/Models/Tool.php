<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tool extends Model
{
    protected $fillable = [
        'asset_code',
        'tool_name',
        'location',
        'maintenance_interval_days',
    ];

    public function maintenances()
    {
        return $this->hasMany(ToolMaintenance::class);
    }

    public function calibrations()
    {
        return $this->hasMany(ToolCalibration::class);
    }

    public function repairs()
    {
        return $this->hasMany(ToolRepair::class);
    }
}
