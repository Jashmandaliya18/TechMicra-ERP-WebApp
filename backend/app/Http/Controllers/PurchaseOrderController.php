<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PurchaseOrder::with(['vendor', 'items.product'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'po_no' => 'required|string|unique:purchase_orders',
            'vendor_id' => 'required|exists:vendors,id',
            'po_date' => 'required|date',
            'valid_until' => 'nullable|date',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.expected_delivery_date' => 'nullable|date',
        ]);

        $po = PurchaseOrder::create($request->only(['po_no', 'vendor_id', 'po_date', 'valid_until']));

        foreach ($validated['items'] as $item) {
            $po->items()->create($item);
        }

        return response()->json($po->load(['vendor', 'items.product']), 201);
    }

    public function show(PurchaseOrder $purchaseOrder)
    {
        return $purchaseOrder->load(['vendor', 'items.product']);
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'vendor_id' => 'sometimes|exists:vendors,id',
            'po_date' => 'sometimes|date',
            'valid_until' => 'nullable|date',
            'status' => 'sometimes|string|in:Pending,Approved,Closed',
            'items' => 'sometimes|array',
        ]);

        $purchaseOrder->update($request->only(['vendor_id', 'po_date', 'valid_until', 'status']));

        if (isset($validated['items'])) {
            $purchaseOrder->items()->delete();
            foreach ($validated['items'] as $item) {
                $purchaseOrder->items()->create($item);
            }
        }

        return response()->json($purchaseOrder->load(['vendor', 'items.product']));
    }

    public function destroy(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->delete();
        return response()->json(null, 204);
    }
}
