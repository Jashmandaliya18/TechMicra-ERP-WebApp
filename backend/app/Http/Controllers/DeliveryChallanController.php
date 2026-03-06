<?php

namespace App\Http\Controllers;

use App\Models\DeliveryChallan;
use App\Models\DeliveryChallanItem;
use Illuminate\Http\Request;

class DeliveryChallanController extends Controller
{
    public function index()
    {
        $challans = DeliveryChallan::with('customer', 'booking.transporter', 'items.product')
            ->orderByDesc('id')
            ->get();
        return response()->json($challans);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'challan_date'         => 'required|date',
            'customer_id'          => 'required|exists:customers,id',
            'logistics_booking_id' => 'nullable|exists:logistics_bookings,id',
            'delivery_address'     => 'nullable|string',
            'items'                => 'required|array|min:1',
            'items.*.product_id'   => 'required|exists:products,id',
            'items.*.quantity'     => 'required|integer|min:1',
        ]);

        // Auto-generate challan_no: DC-YYYYMM-###
        $yearMonth = date('Ym');
        $last = DeliveryChallan::where('challan_no', 'like', "DC-{$yearMonth}-%")
            ->orderByDesc('id')->first();
        $seq = $last ? (intval(explode('-', $last->challan_no)[2]) + 1) : 1;
        $challanNo = "DC-{$yearMonth}-" . str_pad($seq, 3, '0', STR_PAD_LEFT);

        $challan = DeliveryChallan::create([
            'challan_no'           => $challanNo,
            'challan_date'         => $validated['challan_date'],
            'customer_id'          => $validated['customer_id'],
            'logistics_booking_id' => $validated['logistics_booking_id'] ?? null,
            'delivery_address'     => $validated['delivery_address'] ?? null,
        ]);

        foreach ($validated['items'] as $item) {
            DeliveryChallanItem::create([
                'delivery_challan_id' => $challan->id,
                'product_id'          => $item['product_id'],
                'quantity'            => $item['quantity'],
            ]);
        }

        $challan->load('customer', 'booking.transporter', 'items.product');
        return response()->json($challan, 201);
    }

    public function show(DeliveryChallan $deliveryChallan)
    {
        return response()->json($deliveryChallan->load('customer', 'booking.transporter', 'items.product'));
    }

    public function update(Request $request, DeliveryChallan $deliveryChallan)
    {
        $validated = $request->validate([
            'challan_date'         => 'required|date',
            'customer_id'          => 'required|exists:customers,id',
            'logistics_booking_id' => 'nullable|exists:logistics_bookings,id',
            'delivery_address'     => 'nullable|string',
            'items'                => 'nullable|array',
            'items.*.product_id'   => 'required|exists:products,id',
            'items.*.quantity'     => 'required|integer|min:1',
        ]);

        $deliveryChallan->update([
            'challan_date'         => $validated['challan_date'],
            'customer_id'          => $validated['customer_id'],
            'logistics_booking_id' => $validated['logistics_booking_id'] ?? null,
            'delivery_address'     => $validated['delivery_address'] ?? null,
        ]);

        if (!empty($validated['items'])) {
            $deliveryChallan->items()->delete();
            foreach ($validated['items'] as $item) {
                DeliveryChallanItem::create([
                    'delivery_challan_id' => $deliveryChallan->id,
                    'product_id'          => $item['product_id'],
                    'quantity'            => $item['quantity'],
                ]);
            }
        }

        $deliveryChallan->load('customer', 'booking.transporter', 'items.product');
        return response()->json($deliveryChallan);
    }

    public function destroy(DeliveryChallan $deliveryChallan)
    {
        $deliveryChallan->items()->delete();
        $deliveryChallan->delete();
        return response()->json(['message' => 'Challan deleted']);
    }
}
