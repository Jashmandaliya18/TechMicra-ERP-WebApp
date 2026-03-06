<?php

namespace App\Http\Controllers;

use App\Models\BankReconciliation;
use Illuminate\Http\Request;

class BankReconciliationController extends Controller
{
    public function index()
    {
        return response()->json(BankReconciliation::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_account'        => 'nullable|string',
            'statement_date'      => 'required|date',
            'system_balance'      => 'nullable|numeric',
            'bank_balance'        => 'nullable|numeric',
            'unreconciled_amount' => 'nullable|numeric',
            'remarks'             => 'nullable|string',
        ]);
        return response()->json(BankReconciliation::create($validated), 201);
    }

    public function show(BankReconciliation $bankReconciliation)
    {
        return response()->json($bankReconciliation);
    }

    public function update(Request $request, BankReconciliation $bankReconciliation)
    {
        $bankReconciliation->update($request->all());
        return response()->json($bankReconciliation);
    }

    public function destroy(BankReconciliation $bankReconciliation)
    {
        $bankReconciliation->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
