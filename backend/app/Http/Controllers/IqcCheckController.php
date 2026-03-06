<?php

namespace App\Http\Controllers;

use App\Models\IqcCheck;
use Illuminate\Http\Request;

class IqcCheckController extends Controller
{
    public function index()
    {
        return IqcCheck::with('goodsReceiptNote')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'goods_receipt_note_id' => 'required|exists:goods_receipt_notes,id',
            'item_name' => 'required|string',
            'product_id' => 'nullable|exists:products,id',
            'total_qty' => 'required|integer',
            'sample_size' => 'required|integer',
            'accepted_qty' => 'required|integer',
            'rejected_qty' => 'required|integer',
            'status' => 'required|string',
        ]);

        $iqc = IqcCheck::create($validated);

        return response()->json($iqc, 201);
    }

    public function show(IqcCheck $iqcCheck)
    {
        return $iqcCheck->load('goodsReceiptNote');
    }

    public function update(Request $request, IqcCheck $iqcCheck)
    {
        $validated = $request->validate([
            'status' => 'sometimes|string',
            'accepted_qty' => 'sometimes|integer',
            'rejected_qty' => 'sometimes|integer',
        ]);

        $iqcCheck->update($validated);
        return response()->json($iqcCheck);
    }

    public function destroy(IqcCheck $iqcCheck)
    {
        $iqcCheck->delete();
        return response()->json(null, 204);
    }
}
