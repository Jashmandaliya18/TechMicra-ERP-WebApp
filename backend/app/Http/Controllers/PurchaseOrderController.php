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
            'vendor_name' => 'required|string',
            'vendor_id' => 'nullable|exists:vendors,id',
            'po_date' => 'required|date',
            'valid_until' => 'nullable|date',
            'items' => 'required|array',
            'items.*.item_name' => 'required|string',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.expected_delivery_date' => 'nullable|date',
        ]);

        // Auto-generate PO No
        $count = PurchaseOrder::whereDate('created_at', now())->count() + 1;
        $poNo = 'PO-' . now()->format('Ymd') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $totalAmount = collect($validated['items'])->sum(fn($item) => $item['quantity'] * $item['rate']);

        $po = PurchaseOrder::create([
            'po_no' => $poNo,
            'vendor_name' => $validated['vendor_name'],
            'vendor_id' => $validated['vendor_id'] ?? null,
            'po_date' => $validated['po_date'],
            'valid_until' => $validated['valid_until'] ?? null,
            'status' => 'Pending',
            'total_amount' => $totalAmount,
        ]);

        foreach ($validated['items'] as $item) {
            $item['subtotal'] = $item['quantity'] * $item['rate'];
            $item['product_id'] = $item['product_id'] ?? null;
            $item['expected_delivery_date'] = $item['expected_delivery_date'] ?? null;
            $po->items()->create($item);
        }

        return response()->json($po->load(['items']), 201);
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
                $item['subtotal'] = ($item['quantity'] ?? 0) * ($item['rate'] ?? 0);
                $item['product_id'] = $item['product_id'] ?? null;
                $item['expected_delivery_date'] = $item['expected_delivery_date'] ?? null;
                $purchaseOrder->items()->create($item);
            }
            // Recalculate total amount for PO
            $totalAmount = collect($validated['items'])->sum(fn($item) => ($item['quantity'] ?? 0) * ($item['rate'] ?? 0));
            $purchaseOrder->update(['total_amount' => $totalAmount]);
        }

        return response()->json($purchaseOrder->load(['vendor', 'items.product']));
    }

    public function destroy(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->delete();
        return response()->json(null, 204);
    }
}
