<?php

namespace App\Http\Controllers;

use App\Models\ToolCalibration;
use Illuminate\Http\Request;

class ToolCalibrationController extends Controller
{
    public function index()
    {
        return response()->json(ToolCalibration::with('tool')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tool_id' => 'required|exists:tools,id',
            'calibration_date' => 'required|date',
            'standard_value' => 'nullable|string',
            'actual_value' => 'nullable|string',
            'result' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $calibration = ToolCalibration::create($validated);
        return response()->json($calibration, 201);
    }

    public function show($id)
    {
        $calibration = ToolCalibration::with('tool')->findOrFail($id);
        return response()->json($calibration);
    }

    public function update(Request $request, $id)
    {
        $calibration = ToolCalibration::findOrFail($id);
        $validated = $request->validate([
            'tool_id' => 'exists:tools,id',
            'calibration_date' => 'date',
            'standard_value' => 'nullable|string',
            'actual_value' => 'nullable|string',
            'result' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $calibration->update($validated);
        return response()->json($calibration);
    }

    public function destroy($id)
    {
        $calibration = ToolCalibration::findOrFail($id);
        $calibration->delete();
        return response()->json(['message' => 'Calibration record deleted successfully']);
    }
}
