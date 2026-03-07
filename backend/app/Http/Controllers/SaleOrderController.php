<?php

namespace App\Http\Controllers;

use App\Models\SaleOrder;
use App\Models\SaleOrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class SaleOrderController extends Controller
{
    private function nextSoNo(): string
    {
        $prefix = 'SO-' . now()->format('Ym') . '-';
        $last = SaleOrder::where('so_no', 'like', $prefix . '%')
            ->orderByDesc('so_no')->first();
        $seq = $last ? ((int) substr($last->so_no, -3)) + 1 : 1;
        return $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }

    public function index()
    {
        $orders = SaleOrder::with(['customer', 'items.product'])->latest()->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id'        => 'required|exists:customers,id',
            'customer_po_ref'    => 'nullable|string|max:100',
            'billing_address'    => 'nullable|string',
            'shipping_address'   => 'nullable|string',
            'status'             => 'nullable|in:Pending,Dispatched,Closed',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.rate'       => 'required|numeric|min:0',
        ]);

        $so = SaleOrder::create([
            'so_no'           => $this->nextSoNo(),
            'customer_id'     => $data['customer_id'],
            'customer_po_ref' => $data['customer_po_ref'] ?? null,
            'billing_address' => $data['billing_address'] ?? null,
            'shipping_address'=> $data['shipping_address'] ?? null,
            'status'          => $data['status'] ?? 'Pending',
        ]);

        foreach ($data['items'] as $item) {
            SaleOrderItem::create([
                'sale_order_id' => $so->id,
                'product_id'    => $item['product_id'],
                'quantity'      => $item['quantity'],
                'rate'          => $item['rate'],
                'total'         => round($item['quantity'] * $item['rate'], 2),
            ]);
            // Lock inventory: increment blocked_stock
            Product::where('id', $item['product_id'])
                ->increment('blocked_stock', $item['quantity']);
        }

        $so->load(['customer', 'items.product']);
        return response()->json($so, 201);
    }

    public function show(SaleOrder $saleOrder)
    {
        return response()->json($saleOrder->load(['customer', 'items.product', 'dispatchAdvices', 'invoices']));
    }

    public function update(Request $request, SaleOrder $saleOrder)
    {
        $data = $request->validate([
            'customer_id'      => 'required|exists:customers,id',
            'customer_po_ref'  => 'nullable|string|max:100',
            'billing_address'  => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'status'           => 'required|in:Pending,Dispatched,Closed',
        ]);

        $saleOrder->update($data);
        return response()->json($saleOrder->load(['customer', 'items.product']));
    }

    public function destroy(SaleOrder $saleOrder)
    {
        try {
            // Release blocked stock
            foreach ($saleOrder->items as $item) {
                Product::where('id', $item->product_id)
                    ->decrement('blocked_stock', $item->quantity);
            }
            $saleOrder->items()->delete();
            $saleOrder->delete();
            return response()->json(['message' => 'Sale Order deleted successfully.']);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == 23000 || $e->getCode() == 1451) {
                return response()->json(['error' => 'Cannot delete sale order as it has associated records (e.g., invoices).'], 400);
            }
            return response()->json(['error' => 'An error occurred while deleting the sale order.'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
}
