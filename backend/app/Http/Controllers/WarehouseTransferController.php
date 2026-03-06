<?php

namespace App\Http\Controllers;

use App\Models\WarehouseTransfer;
use Illuminate\Http\Request;

class WarehouseTransferController extends Controller
{
    public function index()
    {
        return response()->json(WarehouseTransfer::with(['fromWarehouse', 'toWarehouse', 'product'])->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'from_warehouse_id' => 'required|exists:warehouses,id|different:to_warehouse_id',
            'to_warehouse_id' => 'required|exists:warehouses,id',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'transfer_date' => 'required|date',
            'status' => 'required|in:Pending,Completed',
        ]);

        $latest = WarehouseTransfer::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        $validated['transfer_id'] = 'WT-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        $transfer = WarehouseTransfer::create($validated);
        return response()->json($transfer, 201);
    }

    public function show($id)
    {
        $transfer = WarehouseTransfer::with(['fromWarehouse', 'toWarehouse', 'product'])->findOrFail($id);
        return response()->json($transfer);
    }

    public function update(Request $request, $id)
    {
        $transfer = WarehouseTransfer::findOrFail($id);
        $validated = $request->validate([
            'from_warehouse_id' => 'required|exists:warehouses,id|different:to_warehouse_id',
            'to_warehouse_id' => 'required|exists:warehouses,id',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'transfer_date' => 'required|date',
            'status' => 'required|in:Pending,Completed',
        ]);

        $transfer->update($validated);
        return response()->json($transfer);
    }

    public function destroy($id)
    {
        $transfer = WarehouseTransfer::findOrFail($id);
        $transfer->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
