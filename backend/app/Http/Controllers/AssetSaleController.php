<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AssetSale;

class AssetSaleController extends Controller
{
    public function index()
    {
        return AssetSale::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_tag' => 'required|string|exists:asset_masters,asset_tag',
            'sale_date' => 'required|date',
            'sale_value' => 'required|numeric',
            'book_value' => 'required|numeric'
        ]);

        $prefix = 'SLE-' . date('Ym') . '-';
        $last = AssetSale::where('sale_id', 'like', $prefix . '%')->orderBy('id', 'desc')->first();
        $nextNum = $last ? intval(substr($last->sale_id, -3)) + 1 : 1;
        $validated['sale_id'] = $prefix . str_pad($nextNum, 3, '0', STR_PAD_LEFT);

        \App\Models\AssetMaster::where('asset_tag', $validated['asset_tag'])->update(['status' => 'Disposed']);

        return AssetSale::create($validated);
    }

    public function show(string $id)
    {
        return AssetSale::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $item = AssetSale::findOrFail($id);
        $item->update($request->all());
        return $item;
    }

    public function destroy(string $id)
    {
        $item = AssetSale::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
