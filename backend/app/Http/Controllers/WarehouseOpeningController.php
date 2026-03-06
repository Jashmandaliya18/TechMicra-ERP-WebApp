<?php

namespace App\Http\Controllers;

use App\Models\WarehouseOpening;
use Illuminate\Http\Request;

class WarehouseOpeningController extends Controller
{
    public function index()
    {
        return response()->json(WarehouseOpening::with(['warehouse', 'product'])->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'product_id' => 'required|exists:products,id',
            'opening_qty' => 'required|integer|min:0',
            'value' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        $latest = WarehouseOpening::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        $validated['opening_id'] = 'WO-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        $opening = WarehouseOpening::create($validated);
        return response()->json($opening, 201);
    }

    public function show(WarehouseOpening $warehouseOpening)
    {
        return response()->json($warehouseOpening->load(['warehouse', 'product']));
    }

    public function update(Request $request, $id)
    {
        $opening = WarehouseOpening::findOrFail($id);
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'product_id' => 'required|exists:products,id',
            'opening_qty' => 'required|integer|min:0',
            'value' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        $opening->update($validated);
        return response()->json($opening);
    }

    public function destroy($id)
    {
        $opening = WarehouseOpening::findOrFail($id);
        $opening->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
