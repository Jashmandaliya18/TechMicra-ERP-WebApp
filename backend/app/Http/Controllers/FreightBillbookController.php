<?php

namespace App\Http\Controllers;

use App\Models\FreightBillbook;
use Illuminate\Http\Request;

class FreightBillbookController extends Controller
{
    public function index()
    {
        $bills = FreightBillbook::with('transporter', 'booking')
            ->orderByDesc('id')
            ->get();
        return response()->json($bills);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transporter_id'       => 'required|exists:transporters,id',
            'logistics_booking_id' => 'nullable|exists:logistics_bookings,id',
            'total_freight'        => 'required|numeric|min:0',
            'gst_amount'           => 'required|numeric|min:0',
            'payment_status'       => 'nullable|in:Unpaid,Partial,Paid',
        ]);

        // Auto-generate bill_no: FB-YYYYMM-###
        $yearMonth = date('Ym');
        $last = FreightBillbook::where('bill_no', 'like', "FB-{$yearMonth}-%")
            ->orderByDesc('id')->first();
        $seq = $last ? (intval(explode('-', $last->bill_no)[2]) + 1) : 1;
        $validated['bill_no'] = "FB-{$yearMonth}-" . str_pad($seq, 3, '0', STR_PAD_LEFT);

        // Auto-calculate net_payable
        $validated['net_payable'] = $validated['total_freight'] + $validated['gst_amount'];
        $validated['payment_status'] = $validated['payment_status'] ?? 'Unpaid';

        $bill = FreightBillbook::create($validated);
        $bill->load('transporter', 'booking');

        return response()->json($bill, 201);
    }

    public function show(FreightBillbook $freightBillbook)
    {
        return response()->json($freightBillbook->load('transporter', 'booking'));
    }

    public function update(Request $request, FreightBillbook $freightBillbook)
    {
        $validated = $request->validate([
            'transporter_id'       => 'required|exists:transporters,id',
            'logistics_booking_id' => 'nullable|exists:logistics_bookings,id',
            'total_freight'        => 'required|numeric|min:0',
            'gst_amount'           => 'required|numeric|min:0',
            'payment_status'       => 'nullable|in:Unpaid,Partial,Paid',
        ]);

        // Recalculate net_payable
        $validated['net_payable'] = $validated['total_freight'] + $validated['gst_amount'];

        $freightBillbook->update($validated);
        $freightBillbook->load('transporter', 'booking');

        return response()->json($freightBillbook);
    }

    public function destroy(FreightBillbook $freightBillbook)
    {
        $freightBillbook->delete();
        return response()->json(['message' => 'Freight billbook deleted']);
    }
}
