<?php

namespace App\Http\Controllers;

use App\Models\PurchaseBillbook;
use Illuminate\Http\Request;

class PurchaseBillbookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PurchaseBillbook::with(['vendor', 'goodsReceiptNote', 'items.product'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bill_no' => 'required|string|unique:purchase_billbooks',
            'vendor_id' => 'required|exists:vendors,id',
            'invoice_ref' => 'nullable|string',
            'invoice_date' => 'nullable|date',
            'goods_receipt_note_id' => 'nullable|exists:goods_receipt_notes,id',
            'amount' => 'required|numeric|min:0',
            'gst_amount' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.amount' => 'required|numeric|min:0',
        ]);

        $bill = PurchaseBillbook::create($request->only(['bill_no', 'vendor_id', 'invoice_ref', 'invoice_date', 'goods_receipt_note_id', 'amount', 'gst_amount', 'total_amount']));

        foreach ($validated['items'] as $item) {
            $bill->items()->create($item);
        }

        return response()->json($bill->load(['vendor', 'goodsReceiptNote', 'items.product']), 201);
    }

    public function show(PurchaseBillbook $purchaseBillbook)
    {
        return $purchaseBillbook->load(['vendor', 'goodsReceiptNote', 'items.product']);
    }

    public function update(Request $request, PurchaseBillbook $purchaseBillbook)
    {
        $validated = $request->validate([
            'invoice_ref' => 'nullable|string',
            'invoice_date' => 'nullable|date',
            'amount' => 'sometimes|numeric|min:0',
            'gst_amount' => 'sometimes|numeric|min:0',
            'total_amount' => 'sometimes|numeric|min:0',
            'items' => 'sometimes|array',
        ]);

        $purchaseBillbook->update($request->only(['invoice_ref', 'invoice_date', 'amount', 'gst_amount', 'total_amount']));

        if (isset($validated['items'])) {
            $purchaseBillbook->items()->delete();
            foreach ($validated['items'] as $item) {
                $purchaseBillbook->items()->create($item);
            }
        }

        return response()->json($purchaseBillbook->load(['vendor', 'goodsReceiptNote', 'items.product']));
    }

    public function destroy(PurchaseBillbook $purchaseBillbook)
    {
        $purchaseBillbook->delete();
        return response()->json(null, 204);
    }
}
