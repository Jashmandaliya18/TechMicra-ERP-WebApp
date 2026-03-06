<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AssetMaster;

class AssetMasterController extends Controller
{
    public function index()
    {
        return AssetMaster::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'group' => 'required|in:IT,Plant,Furniture',
            'purchase_date' => 'required|date',
            'value' => 'required|numeric'
        ]);

        $prefix = 'AST-' . date('Ym') . '-';
        $last = AssetMaster::where('asset_tag', 'like', $prefix . '%')->orderBy('id', 'desc')->first();
        $nextNum = $last ? intval(substr($last->asset_tag, -3)) + 1 : 1;
        $validated['asset_tag'] = $prefix . str_pad($nextNum, 3, '0', STR_PAD_LEFT);
        $validated['status'] = 'Active';

        return AssetMaster::create($validated);
    }

    public function show(string $id)
    {
        return AssetMaster::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $item = AssetMaster::findOrFail($id);
        $item->update($request->all());
        return $item;
    }

    public function destroy(string $id)
    {
        $item = AssetMaster::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
