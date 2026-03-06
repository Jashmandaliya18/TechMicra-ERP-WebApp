<?php

namespace App\Http\Controllers;

use App\Models\ProductionReport;
use Illuminate\Http\Request;

class ProductionReportController extends Controller
{
    public function index()
    {
        return response()->json(ProductionReport::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'shift' => 'required|string',
            'machine_no' => 'required|string',
            'operator' => 'required|string',
            'production_qty' => 'required|integer',
            'rejection_qty' => 'required|integer',
        ]);

        $report = ProductionReport::create($validated);
        return response()->json($report, 201);
    }
}
