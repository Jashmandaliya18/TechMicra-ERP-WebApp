<?php

namespace App\Http\Controllers;

use App\Models\PurchaseSchedule;
use Illuminate\Http\Request;

class PurchaseScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PurchaseSchedule::with('purchaseOrder')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'expected_date' => 'required|date',
            'follow_up_status' => 'required|string|in:Pending,On-Time,Delayed',
            'remarks' => 'nullable|string',
        ]);

        $schedule = PurchaseSchedule::create($validated);
        return response()->json($schedule->load('purchaseOrder'), 201);
    }

    public function show(PurchaseSchedule $purchaseSchedule)
    {
        return $purchaseSchedule->load('purchaseOrder');
    }

    public function update(Request $request, PurchaseSchedule $purchaseSchedule)
    {
        $validated = $request->validate([
            'expected_date' => 'sometimes|date',
            'follow_up_status' => 'sometimes|string|in:Pending,On-Time,Delayed',
            'remarks' => 'nullable|string',
        ]);

        $purchaseSchedule->update($validated);
        return response()->json($purchaseSchedule->load('purchaseOrder'));
    }

    public function destroy(PurchaseSchedule $purchaseSchedule)
    {
        $purchaseSchedule->delete();
        return response()->json(null, 204);
    }
}
