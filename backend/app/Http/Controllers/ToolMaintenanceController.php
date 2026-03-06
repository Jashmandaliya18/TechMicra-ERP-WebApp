<?php

namespace App\Http\Controllers;

use App\Models\ToolMaintenance;
use Illuminate\Http\Request;

class ToolMaintenanceController extends Controller
{
    public function index()
    {
        return response()->json(ToolMaintenance::with('tool')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tool_id' => 'required|exists:tools,id',
            'scheduled_date' => 'required|date',
            'task_list' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $maintenance = ToolMaintenance::create($validated);
        return response()->json($maintenance, 201);
    }

    public function show($id)
    {
        $maintenance = ToolMaintenance::with('tool')->findOrFail($id);
        return response()->json($maintenance);
    }

    public function update(Request $request, $id)
    {
        $maintenance = ToolMaintenance::findOrFail($id);
        $validated = $request->validate([
            'tool_id' => 'exists:tools,id',
            'scheduled_date' => 'date',
            'task_list' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $maintenance->update($validated);
        return response()->json($maintenance);
    }

    public function destroy($id)
    {
        $maintenance = ToolMaintenance::findOrFail($id);
        $maintenance->delete();
        return response()->json(['message' => 'Maintenance record deleted successfully']);
    }
}
