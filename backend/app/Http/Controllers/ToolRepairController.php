<?php

namespace App\Http\Controllers;

use App\Models\ToolRepair;
use Illuminate\Http\Request;

class ToolRepairController extends Controller
{
    public function index()
    {
        return response()->json(ToolRepair::with('tool')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'nullable|string',
            'tool_id' => 'required|exists:tools,id',
            'issue' => 'nullable|string',
            'spares_used' => 'nullable|string',
            'cost' => 'nullable|numeric',
            'technician' => 'nullable|string',
            'repair_date' => 'nullable|date',
        ]);

        $repair = ToolRepair::create($validated);
        return response()->json($repair, 201);
    }

    public function show($id)
    {
        $repair = ToolRepair::with('tool')->findOrFail($id);
        return response()->json($repair);
    }

    public function update(Request $request, $id)
    {
        $repair = ToolRepair::findOrFail($id);
        $validated = $request->validate([
            'job_id' => 'nullable|string',
            'tool_id' => 'exists:tools,id',
            'issue' => 'nullable|string',
            'spares_used' => 'nullable|string',
            'cost' => 'nullable|numeric',
            'technician' => 'nullable|string',
            'repair_date' => 'nullable|date',
        ]);

        $repair->update($validated);
        return response()->json($repair);
    }

    public function destroy($id)
    {
        $repair = ToolRepair::findOrFail($id);
        $repair->delete();
        return response()->json(['message' => 'Repair record deleted successfully']);
    }
}
