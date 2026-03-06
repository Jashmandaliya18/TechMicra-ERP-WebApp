<?php

namespace App\Http\Controllers;

use App\Models\GoodsReceiptNote;
use Illuminate\Http\Request;

class GoodsReceiptNoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return GoodsReceiptNote::with(['purchaseOrder', 'items.product'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'vendor_challan_no' => 'nullable|string',
            'gate_entry_date' => 'required|date',
            'vehicle_no' => 'nullable|string',
            'items' => 'required|array',
            'items.*.item_name' => 'required|string',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.received_qty' => 'required|integer|min:0',
        ]);

        // Auto-generate GRN No
        $count = GoodsReceiptNote::whereDate('created_at', now())->count() + 1;
        $grnNo = 'GRN-' . now()->format('Ymd') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $grn = GoodsReceiptNote::create([
            'grn_no' => $grnNo,
            'purchase_order_id' => $validated['purchase_order_id'],
            'vendor_challan_no' => $validated['vendor_challan_no'],
            'gate_entry_date' => $validated['gate_entry_date'],
            'vehicle_no' => $validated['vehicle_no'],
        ]);

        foreach ($validated['items'] as $item) {
            $grn->items()->create($item);
        }

        return response()->json($grn->load(['purchaseOrder', 'items']), 201);
    }

    public function show(GoodsReceiptNote $goodsReceiptNote)
    {
        return $goodsReceiptNote->load(['purchaseOrder', 'items.product']);
    }

    public function update(Request $request, GoodsReceiptNote $goodsReceiptNote)
    {
        $validated = $request->validate([
            'vendor_challan_no' => 'nullable|string',
            'gate_entry_date' => 'sometimes|date',
            'vehicle_no' => 'nullable|string',
            'items' => 'sometimes|array',
        ]);

        $goodsReceiptNote->update($request->only(['vendor_challan_no', 'gate_entry_date', 'vehicle_no']));

        if (isset($validated['items'])) {
            $goodsReceiptNote->items()->delete();
            foreach ($validated['items'] as $item) {
                $goodsReceiptNote->items()->create($item);
            }
        }

        return response()->json($goodsReceiptNote->load(['purchaseOrder', 'items.product']));
    }

    public function destroy(GoodsReceiptNote $goodsReceiptNote)
    {
        $goodsReceiptNote->delete();
        return response()->json(null, 204);
    }
}
