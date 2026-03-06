<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Illuminate\Http\Request;

class ToolController extends Controller
{
    public function index()
    {
        return response()->json(Tool::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_code' => 'required|string|unique:tools,asset_code',
            'tool_name' => 'required|string',
            'location' => 'nullable|string',
            'maintenance_interval_days' => 'nullable|integer',
        ]);

        $tool = Tool::create($validated);
        return response()->json($tool, 201);
    }

    public function show(Tool $tool)
    {
        return response()->json($tool);
    }

    public function update(Request $request, Tool $tool)
    {
        $validated = $request->validate([
            'asset_code' => 'string|unique:tools,asset_code,' . $tool->id,
            'tool_name' => 'string',
            'location' => 'nullable|string',
            'maintenance_interval_days' => 'nullable|integer',
        ]);

        $tool->update($validated);
        return response()->json($tool);
    }

    public function destroy(Tool $tool)
    {
        $tool->delete();
        return response()->json(['message' => 'Tool deleted successfully']);
    }
}
