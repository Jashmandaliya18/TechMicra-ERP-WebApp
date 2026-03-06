<?php

namespace App\Http\Controllers;

use App\Models\LogisticsBooking;
use Illuminate\Http\Request;

class LogisticsBookingController extends Controller
{
    public function index()
    {
        $bookings = LogisticsBooking::with('transporter', 'saleOrder')
            ->orderByDesc('id')
            ->get();
        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_date'   => 'required|date',
            'transporter_id' => 'required|exists:transporters,id',
            'sale_order_id'  => 'nullable|exists:sale_orders,id',
            'freight_amount' => 'nullable|numeric|min:0',
            'advance_paid'   => 'nullable|numeric|min:0',
            'status'         => 'nullable|in:Booked,In-Transit,Delivered',
        ]);

        // Auto-generate booking_no: BK-YYYYMM-###
        $yearMonth = date('Ym');
        $last = LogisticsBooking::where('booking_no', 'like', "BK-{$yearMonth}-%")
            ->orderByDesc('id')->first();
        $seq = $last ? (intval(explode('-', $last->booking_no)[2]) + 1) : 1;
        $validated['booking_no'] = "BK-{$yearMonth}-" . str_pad($seq, 3, '0', STR_PAD_LEFT);
        $validated['status'] = $validated['status'] ?? 'Booked';

        $booking = LogisticsBooking::create($validated);
        $booking->load('transporter', 'saleOrder');

        return response()->json($booking, 201);
    }

    public function show(LogisticsBooking $logisticsBooking)
    {
        return response()->json($logisticsBooking->load('transporter', 'saleOrder', 'challans'));
    }

    public function update(Request $request, LogisticsBooking $logisticsBooking)
    {
        $validated = $request->validate([
            'booking_date'   => 'required|date',
            'transporter_id' => 'required|exists:transporters,id',
            'sale_order_id'  => 'nullable|exists:sale_orders,id',
            'freight_amount' => 'nullable|numeric|min:0',
            'advance_paid'   => 'nullable|numeric|min:0',
            'status'         => 'nullable|in:Booked,In-Transit,Delivered',
        ]);

        $logisticsBooking->update($validated);
        $logisticsBooking->load('transporter', 'saleOrder');

        return response()->json($logisticsBooking);
    }

    public function destroy(LogisticsBooking $logisticsBooking)
    {
        $logisticsBooking->delete();
        return response()->json(['message' => 'Booking deleted']);
    }
}
