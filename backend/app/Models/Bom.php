<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bom extends Model
{
    use HasFactory;

    protected $fillable = [
        'finished_good',
        'process_name',
        'machine',
        'raw_material_input',
        'output_qty',
    ];
}
