<?php

namespace App\Http\Controllers;

use App\Models\MaterialTransferSlip;
use Illuminate\Http\Request;

class MaterialTransferSlipController extends Controller
{
    public function index()
    {
        return MaterialTransferSlip::with(['mta', 'product'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mta_id' => 'required|exists:material_transfer_advice,id',
            'product_id' => 'required|exists:products,id',
            'qty_checked' => 'required|integer|min:1',
            'status' => 'required|in:OK,Damaged',
        ]);

        $mts = MaterialTransferSlip::create($validated);
        return response()->json($mts->load(['mta', 'product']), 201);
    }

    public function show(MaterialTransferSlip $materialTransferSlip)
    {
        return $materialTransferSlip->load(['mta', 'product']);
    }

    public function update(Request $request, MaterialTransferSlip $materialTransferSlip)
    {
        $validated = $request->validate([
            'qty_checked' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:OK,Damaged',
        ]);

        $materialTransferSlip->update($validated);
        return response()->json($materialTransferSlip->load(['mta', 'product']));
    }

    public function destroy(MaterialTransferSlip $materialTransferSlip)
    {
        $materialTransferSlip->delete();
        return response()->json(null, 204);
    }
}
