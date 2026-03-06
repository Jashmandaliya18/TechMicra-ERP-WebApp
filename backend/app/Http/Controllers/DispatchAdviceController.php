<?php

namespace App\Http\Controllers;

use App\Models\DispatchAdvice;
use App\Models\SaleOrder;
use Illuminate\Http\Request;

class DispatchAdviceController extends Controller
{
    private function nextDispatchId(): string
    {
        $prefix = 'DA-' . now()->format('Ym') . '-';
        $last = DispatchAdvice::where('dispatch_id', 'like', $prefix . '%')
            ->orderByDesc('dispatch_id')->first();
        $seq = $last ? ((int) substr($last->dispatch_id, -3)) + 1 : 1;
        return $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }

    public function index()
    {
        return response()->json(
            DispatchAdvice::with(['saleOrder.customer'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sale_order_id'   => 'required|exists:sale_orders,id',
            'transporter_name'=> 'nullable|string|max:255',
            'vehicle_no'      => 'nullable|string|max:50',
            'driver_name'     => 'nullable|string|max:255',
        ]);

        $dispatch = DispatchAdvice::create([
            'dispatch_id'     => $this->nextDispatchId(),
            'sale_order_id'   => $data['sale_order_id'],
            'transporter_name'=> $data['transporter_name'] ?? null,
            'vehicle_no'      => $data['vehicle_no'] ?? null,
            'driver_name'     => $data['driver_name'] ?? null,
        ]);

        // Update SO status to Dispatched
        SaleOrder::where('id', $data['sale_order_id'])->update(['status' => 'Dispatched']);

        $dispatch->load('saleOrder.customer');
        return response()->json($dispatch, 201);
    }

    public function show(DispatchAdvice $dispatchAdvice)
    {
        return response()->json($dispatchAdvice->load('saleOrder.customer'));
    }

    public function update(Request $request, DispatchAdvice $dispatchAdvice)
    {
        $data = $request->validate([
            'transporter_name'=> 'nullable|string|max:255',
            'vehicle_no'      => 'nullable|string|max:50',
            'driver_name'     => 'nullable|string|max:255',
        ]);

        $dispatchAdvice->update($data);
        return response()->json($dispatchAdvice->load('saleOrder.customer'));
    }

    public function destroy(DispatchAdvice $dispatchAdvice)
    {
        $dispatchAdvice->delete();
        return response()->json(['message' => 'Dispatch Advice deleted successfully.']);
    }
}
