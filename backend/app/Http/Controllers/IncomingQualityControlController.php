<?php

namespace App\Http\Controllers;

use App\Models\IncomingQualityControl;
use Illuminate\Http\Request;

class IncomingQualityControlController extends Controller
{
    public function index()
    {
        return IncomingQualityControl::with(['grn', 'product'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'goods_receipt_note_id' => 'required|exists:goods_receipt_notes,id',
            'product_id' => 'required|exists:products,id',
            'total_qty' => 'required|integer|min:1',
            'sample_size' => 'required|integer|min:1',
            'accepted_qty' => 'required|integer|min:0',
            'rejected_qty' => 'required|integer|min:0',
            'visual_check' => 'required|in:Pass,Fail',
            'dimension_check' => 'nullable|string',
        ]);

        $iqc = IncomingQualityControl::create($validated);
        return response()->json($iqc->load(['grn', 'product']), 201);
    }

    public function show(IncomingQualityControl $incomingQualityControl)
    {
        return $incomingQualityControl->load(['grn', 'product']);
    }

    public function update(Request $request, IncomingQualityControl $incomingQualityControl)
    {
        $validated = $request->validate([
            'accepted_qty' => 'sometimes|integer|min:0',
            'rejected_qty' => 'sometimes|integer|min:0',
            'visual_check' => 'sometimes|in:Pass,Fail',
            'dimension_check' => 'nullable|string',
        ]);

        $incomingQualityControl->update($validated);
        return response()->json($incomingQualityControl->load(['grn', 'product']));
    }

    public function destroy(IncomingQualityControl $incomingQualityControl)
    {
        $incomingQualityControl->delete();
        return response()->json(null, 204);
    }
}
