<?php

namespace App\Http\Controllers;

use App\Models\MaterialReceipt;
use Illuminate\Http\Request;

class MaterialReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return MaterialReceipt::with('goodsReceiptNote')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receipt_id' => 'required|string|unique:material_receipts',
            'goods_receipt_note_id' => 'required|exists:goods_receipt_notes,id',
            'storage_location' => 'nullable|string',
            'batch_no' => 'nullable|string',
        ]);

        $receipt = MaterialReceipt::create($validated);
        return response()->json($receipt->load('goodsReceiptNote'), 201);
    }

    public function show(MaterialReceipt $materialReceipt)
    {
        return $materialReceipt->load('goodsReceiptNote');
    }

    public function update(Request $request, MaterialReceipt $materialReceipt)
    {
        $validated = $request->validate([
            'storage_location' => 'nullable|string',
            'batch_no' => 'nullable|string',
        ]);

        $materialReceipt->update($validated);
        return response()->json($materialReceipt->load('goodsReceiptNote'));
    }

    public function destroy(MaterialReceipt $materialReceipt)
    {
        $materialReceipt->delete();
        return response()->json(null, 204);
    }
}
