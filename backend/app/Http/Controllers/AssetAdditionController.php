<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AssetAddition;

class AssetAdditionController extends Controller
{
    public function index()
    {
        return AssetAddition::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_tag' => 'required|string|exists:asset_masters,asset_tag',
            'invoice_ref' => 'required|string',
            'installation_date' => 'required|date',
            'depreciation_rate_percent' => 'required|numeric'
        ]);

        $prefix = 'ADD-' . date('Ym') . '-';
        $last = AssetAddition::where('addition_id', 'like', $prefix . '%')->orderBy('id', 'desc')->first();
        $nextNum = $last ? intval(substr($last->addition_id, -3)) + 1 : 1;
        $validated['addition_id'] = $prefix . str_pad($nextNum, 3, '0', STR_PAD_LEFT);

        return AssetAddition::create($validated);
    }

    public function show(string $id)
    {
        return AssetAddition::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $item = AssetAddition::findOrFail($id);
        $item->update($request->all());
        return $item;
    }

    public function destroy(string $id)
    {
        $item = AssetAddition::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
