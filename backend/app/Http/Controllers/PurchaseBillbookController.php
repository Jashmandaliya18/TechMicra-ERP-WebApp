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
        return PurchaseBillbook::with(['purchaseOrder'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'vendor_invoice_no' => 'nullable|string',
            'invoice_date' => 'nullable|date',
            'taxable_value' => 'required|numeric|min:0',
            'gst_amount' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        // Auto-generate Bill ID
        $count = PurchaseBillbook::whereDate('created_at', now())->count() + 1;
        $billId = 'BILL-' . now()->format('Ymd') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $bill = PurchaseBillbook::create([
            'bill_id' => $billId,
            'purchase_order_id' => $validated['purchase_order_id'],
            'vendor_invoice_no' => $validated['vendor_invoice_no'],
            'invoice_date' => $validated['invoice_date'],
            'taxable_value' => $validated['taxable_value'],
            'gst_amount' => $validated['gst_amount'],
            'total_amount' => $validated['total_amount'],
        ]);

        return response()->json($bill, 201);
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
