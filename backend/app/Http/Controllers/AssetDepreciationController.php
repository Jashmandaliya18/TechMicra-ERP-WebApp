<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AssetDepreciation;

class AssetDepreciationController extends Controller
{
    public function index()
    {
        return AssetDepreciation::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer',
            'asset_tag' => 'required|string|exists:asset_masters,asset_tag',
            'opening_balance' => 'required|numeric',
            'depreciation_amount' => 'required|numeric',
            'closing_balance' => 'required|numeric'
        ]);

        $prefix = 'DEP-' . date('Y') . '-';
        $last = AssetDepreciation::where('depreciation_id', 'like', $prefix . '%')->orderBy('id', 'desc')->first();
        $nextNum = $last ? intval(substr($last->depreciation_id, -3)) + 1 : 1;
        $validated['depreciation_id'] = $prefix . str_pad($nextNum, 3, '0', STR_PAD_LEFT);

        return AssetDepreciation::create($validated);
    }

    public function show(string $id)
    {
        return AssetDepreciation::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $item = AssetDepreciation::findOrFail($id);
        $item->update($request->all());
        return $item;
    }

    public function destroy(string $id)
    {
        $item = AssetDepreciation::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
