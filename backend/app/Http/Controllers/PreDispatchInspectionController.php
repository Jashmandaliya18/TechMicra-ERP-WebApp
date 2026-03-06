<?php

namespace App\Http\Controllers;

use App\Models\PreDispatchInspection;
use Illuminate\Http\Request;

class PreDispatchInspectionController extends Controller
{
    public function index()
    {
        return PreDispatchInspection::with(['saleOrder', 'product', 'user'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_order_id' => 'required|exists:sale_orders,id',
            'product_id' => 'required|exists:products,id',
            'inspected_qty' => 'required|integer|min:1',
            'passed_qty' => 'required|integer|min:0',
            'failed_qty' => 'required|integer|min:0',
            'box_no' => 'required|string',
            'packaging_condition' => 'required|in:OK,Damaged',
            'label_accuracy' => 'required|in:Pass,Fail',
            'result' => 'required|in:Approved,Rejected,Conditional',
            'inspected_by' => 'required|exists:users,id',
            'inspection_date' => 'required|date',
            'remarks' => 'nullable|string',
        ]);

        $validated['pdi_no'] = 'PDI-' . date('Ym') . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);

        $pdi = PreDispatchInspection::create($validated);
        return response()->json($pdi->load(['saleOrder', 'product', 'user']), 201);
    }

    public function show(PreDispatchInspection $preDispatchInspection)
    {
        return $preDispatchInspection->load(['saleOrder', 'product', 'user']);
    }

    public function update(Request $request, PreDispatchInspection $preDispatchInspection)
    {
        $validated = $request->validate([
            'passed_qty' => 'sometimes|integer|min:0',
            'failed_qty' => 'sometimes|integer|min:0',
            'box_no' => 'sometimes|string',
            'packaging_condition' => 'sometimes|in:OK,Damaged',
            'label_accuracy' => 'sometimes|in:Pass,Fail',
            'result' => 'sometimes|in:Approved,Rejected,Conditional',
            'remarks' => 'nullable|string',
        ]);

        $preDispatchInspection->update($validated);
        return response()->json($preDispatchInspection->load(['saleOrder', 'product', 'user']));
    }

    public function destroy(PreDispatchInspection $preDispatchInspection)
    {
        $preDispatchInspection->delete();
        return response()->json(null, 204);
    }
}
