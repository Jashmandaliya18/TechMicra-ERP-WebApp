<?php

namespace App\Http\Controllers;

use App\Models\ContraVoucher;
use Illuminate\Http\Request;

class ContraVoucherController extends Controller
{
    public function index()
    {
        return response()->json(ContraVoucher::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date'         => 'required|date',
            'from_account' => 'nullable|string',
            'to_account'   => 'nullable|string',
            'amount'       => 'nullable|numeric',
            'remarks'      => 'nullable|string',
        ]);
        return response()->json(ContraVoucher::create($validated), 201);
    }

    public function show(ContraVoucher $contraVoucher)
    {
        return response()->json($contraVoucher);
    }

    public function update(Request $request, ContraVoucher $contraVoucher)
    {
        $contraVoucher->update($request->all());
        return response()->json($contraVoucher);
    }

    public function destroy(ContraVoucher $contraVoucher)
    {
        $contraVoucher->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
