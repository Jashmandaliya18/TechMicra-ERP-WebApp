<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AssetAllocation;

class AssetAllocationController extends Controller
{
    public function index()
    {
        return AssetAllocation::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_tag' => 'required|string|exists:asset_masters,asset_tag',
            'employee_name' => 'required|string',
            'department' => 'required|string',
            'date_assigned' => 'required|date'
        ]);

        $prefix = 'ALC-' . date('Ym') . '-';
        $last = AssetAllocation::where('allocation_id', 'like', $prefix . '%')->orderBy('id', 'desc')->first();
        $nextNum = $last ? intval(substr($last->allocation_id, -3)) + 1 : 1;
        $validated['allocation_id'] = $prefix . str_pad($nextNum, 3, '0', STR_PAD_LEFT);

        // Update Master status
        \App\Models\AssetMaster::where('asset_tag', $validated['asset_tag'])->update(['status' => 'Allocated']);

        return AssetAllocation::create($validated);
    }

    public function show(string $id)
    {
        return AssetAllocation::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $item = AssetAllocation::findOrFail($id);
        $item->update($request->all());
        return $item;
    }

    public function destroy(string $id)
    {
        $item = AssetAllocation::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
