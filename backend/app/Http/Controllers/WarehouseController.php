<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function index()
    {
        return response()->json(Warehouse::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'manager_name' => 'nullable|string|max:255',
        ]);

        $latest = Warehouse::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        $validated['warehouse_id'] = 'WH-' . str_pad($nextId, 3, '0', STR_PAD_LEFT);

        $warehouse = Warehouse::create($validated);
        return response()->json($warehouse, 201);
    }

    public function show(Warehouse $warehouse)
    {
        return response()->json($warehouse);
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'manager_name' => 'nullable|string|max:255',
        ]);

        $warehouse->update($validated);
        return response()->json($warehouse);
    }

    public function destroy(Warehouse $warehouse)
    {
        $warehouse->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
