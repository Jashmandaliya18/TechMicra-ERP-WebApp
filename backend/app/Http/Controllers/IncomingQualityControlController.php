<?php

namespace App\Http\Controllers;

use App\Models\IncomingQualityControl;
use Illuminate\Http\Request;

class IncomingQualityControlController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return IncomingQualityControl::with(['goodsReceiptNote', 'product'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'goods_receipt_note_id' => 'required|exists:goods_receipt_notes,id',
            'product_id' => 'required|exists:products,id',
            'total_qty' => 'required|integer|min:0',
            'sample_size' => 'required|integer|min:0',
            'accepted_qty' => 'required|integer|min:0',
            'rejected_qty' => 'required|integer|min:0',
        ]);

        $iqc = IncomingQualityControl::create($validated);
        return response()->json($iqc->load(['goodsReceiptNote', 'product']), 201);
    }

    public function show(IncomingQualityControl $incomingQualityControl)
    {
        return $incomingQualityControl->load(['goodsReceiptNote', 'product']);
    }

    public function update(Request $request, IncomingQualityControl $incomingQualityControl)
    {
        $validated = $request->validate([
            'total_qty' => 'sometimes|integer|min:0',
            'sample_size' => 'sometimes|integer|min:0',
            'accepted_qty' => 'sometimes|integer|min:0',
            'rejected_qty' => 'sometimes|integer|min:0',
        ]);

        $incomingQualityControl->update($validated);
        return response()->json($incomingQualityControl->load(['goodsReceiptNote', 'product']));
    }

    public function destroy(IncomingQualityControl $incomingQualityControl)
    {
        $incomingQualityControl->delete();
        return response()->json(null, 204);
    }
}
