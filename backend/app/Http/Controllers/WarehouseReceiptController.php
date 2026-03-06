<?php

namespace App\Http\Controllers;

use App\Models\WarehouseReceipt;
use Illuminate\Http\Request;

class WarehouseReceiptController extends Controller
{
    public function index()
    {
        return response()->json(WarehouseReceipt::with('product')->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'source_doc_ref' => 'nullable|string|max:255',
            'product_id' => 'required|exists:products,id',
            'qty_received' => 'required|integer|min:1',
            'receipt_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $latest = WarehouseReceipt::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        $validated['receipt_id'] = 'WR-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        $receipt = WarehouseReceipt::create($validated);
        return response()->json($receipt, 201);
    }

    public function show($id)
    {
        $receipt = WarehouseReceipt::with('product')->findOrFail($id);
        return response()->json($receipt);
    }

    public function update(Request $request, $id)
    {
        $receipt = WarehouseReceipt::findOrFail($id);
        $validated = $request->validate([
            'source_doc_ref' => 'nullable|string|max:255',
            'product_id' => 'required|exists:products,id',
            'qty_received' => 'required|integer|min:1',
            'receipt_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $receipt->update($validated);
        return response()->json($receipt);
    }

    public function destroy($id)
    {
        $receipt = WarehouseReceipt::findOrFail($id);
        $receipt->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
