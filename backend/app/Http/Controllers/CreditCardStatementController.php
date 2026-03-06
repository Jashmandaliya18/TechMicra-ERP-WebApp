<?php

namespace App\Http\Controllers;

use App\Models\CreditCardStatement;
use Illuminate\Http\Request;

class CreditCardStatementController extends Controller
{
    public function index()
    {
        return response()->json(CreditCardStatement::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'card_no'          => 'nullable|string',
            'statement_month'  => 'nullable|string',
            'transaction_date' => 'nullable|date',
            'merchant'         => 'nullable|string',
            'amount'           => 'nullable|numeric',
            'expense_head'     => 'nullable|string',
            'remarks'          => 'nullable|string',
        ]);
        return response()->json(CreditCardStatement::create($validated), 201);
    }

    public function show(CreditCardStatement $creditCardStatement)
    {
        return response()->json($creditCardStatement);
    }

    public function update(Request $request, CreditCardStatement $creditCardStatement)
    {
        $creditCardStatement->update($request->all());
        return response()->json($creditCardStatement);
    }

    public function destroy(CreditCardStatement $creditCardStatement)
    {
        $creditCardStatement->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
