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
            'goods_receipt_note_id' => 'required|exists:goods_receipt_notes,id',
            'storage_location' => 'nullable|string',
            'batch_no' => 'nullable|string',
        ]);

        // Auto-generate Receipt ID
        $count = MaterialReceipt::whereDate('created_at', now())->count() + 1;
        $receiptId = 'REC-' . now()->format('Ymd') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $receipt = MaterialReceipt::create([
            'receipt_id' => $receiptId,
            'goods_receipt_note_id' => $validated['goods_receipt_note_id'],
            'storage_location' => $validated['storage_location'],
            'batch_no' => $validated['batch_no'],
        ]);

        // Stock Update Logic (Conceptual: incrementing stock for each item in the GRN)
        $grn = $receipt->goodsReceiptNote;
        foreach ($grn->items as $item) {
            if ($item->product_id) {
                // Assuming Product model has a way to update stock
                // $item->product->increment('stock', $item->received_qty);
            }
        }

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
