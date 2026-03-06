<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\InquiryItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class InquiryController extends Controller
{
    /** Auto-generate next inquiry number: INQ-YYYYMM-### */
    private function nextInquiryNo(): string
    {
        $prefix = 'INQ-' . now()->format('Ym') . '-';
        $last = Inquiry::where('inquiry_no', 'like', $prefix . '%')
            ->orderByDesc('inquiry_no')->first();
        $seq = $last ? ((int) substr($last->inquiry_no, -3)) + 1 : 1;
        return $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }

    /** Stock checking: returns calculation + delivery date per item */
    private function stockCheck(array $items): array
    {
        $result = [];
        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if (!$product) continue;
            $netAvailable = $product->net_available;
            $qty = (int) $item['quantity'];
            if ($netAvailable >= $qty) {
                $deliveryDate = now()->addDays(2)->toDateString();
                $stockStatus = 'Available';
            } else {
                $deliveryDate = now()->addDays(7)->toDateString(); // default production time
                $stockStatus = 'Requires Production';
            }
            $result[] = [
                'product_id'    => $product->id,
                'product_name'  => $product->name,
                'current_stock' => $product->current_stock,
                'blocked_stock' => $product->blocked_stock,
                'net_available' => $netAvailable,
                'inquiry_qty'   => $qty,
                'stock_status'  => $stockStatus,
                'delivery_date' => $deliveryDate,
            ];
        }
        return $result;
    }

    public function index()
    {
        $inquiries = Inquiry::with(['customer', 'salesPerson', 'items.product'])->latest()->get();
        return response()->json($inquiries);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id'       => 'required|exists:customers,id',
            'inquiry_date'      => 'required|date',
            'status'            => 'nullable|in:New,Processing,Quoted,Lost',
            'items'             => 'required|array|min:1',
            'items.*.product_id'=> 'required|exists:products,id',
            'items.*.quantity'  => 'required|integer|min:1',
            'items.*.target_price' => 'nullable|numeric|min:0',
        ]);

        $inquiry = Inquiry::create([
            'inquiry_no'     => $this->nextInquiryNo(),
            'customer_id'    => $data['customer_id'],
            'sales_person_id'=> auth()->id(),
            'inquiry_date'   => $data['inquiry_date'],
            'status'         => $data['status'] ?? 'New',
        ]);

        foreach ($data['items'] as $item) {
            InquiryItem::create([
                'inquiry_id'   => $inquiry->id,
                'product_id'   => $item['product_id'],
                'quantity'     => $item['quantity'],
                'target_price' => $item['target_price'] ?? null,
            ]);
        }

        $inquiry->load(['customer', 'salesPerson', 'items.product']);
        $inquiry->stock_check = $this->stockCheck($data['items']);

        return response()->json($inquiry, 201);
    }

    public function show(Inquiry $inquiry)
    {
        $inquiry->load(['customer', 'salesPerson', 'items.product', 'quotations.items.product']);
        $items = $inquiry->items->map(fn ($i) => [
            'product_id' => $i->product_id,
            'quantity'   => $i->quantity,
        ])->toArray();
        $inquiry->stock_check = $this->stockCheck($items);
        return response()->json($inquiry);
    }

    public function update(Request $request, Inquiry $inquiry)
    {
        $data = $request->validate([
            'customer_id'       => 'required|exists:customers,id',
            'inquiry_date'      => 'required|date',
            'status'            => 'required|in:New,Processing,Quoted,Lost',
            'items'             => 'required|array|min:1',
            'items.*.product_id'=> 'required|exists:products,id',
            'items.*.quantity'  => 'required|integer|min:1',
            'items.*.target_price' => 'nullable|numeric|min:0',
        ]);

        $inquiry->update([
            'customer_id'  => $data['customer_id'],
            'inquiry_date' => $data['inquiry_date'],
            'status'       => $data['status'],
        ]);

        $inquiry->items()->delete();
        foreach ($data['items'] as $item) {
            InquiryItem::create([
                'inquiry_id'   => $inquiry->id,
                'product_id'   => $item['product_id'],
                'quantity'     => $item['quantity'],
                'target_price' => $item['target_price'] ?? null,
            ]);
        }

        $inquiry->load(['customer', 'salesPerson', 'items.product']);
        return response()->json($inquiry);
    }

    public function destroy(Inquiry $inquiry)
    {
        $inquiry->items()->delete();
        $inquiry->delete();
        return response()->json(['message' => 'Inquiry deleted successfully.']);
    }
}
