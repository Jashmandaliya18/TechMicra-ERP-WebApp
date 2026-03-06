<?php

namespace App\Http\Controllers;

use App\Models\JournalVoucher;
use Illuminate\Http\Request;

class JournalVoucherController extends Controller
{
    public function index()
    {
        return response()->json(JournalVoucher::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'journal_no'     => 'nullable|string',
            'date'           => 'required|date',
            'debit_account'  => 'nullable|string',
            'credit_account' => 'nullable|string',
            'amount'         => 'nullable|numeric',
            'narration'      => 'nullable|string',
        ]);
        return response()->json(JournalVoucher::create($validated), 201);
    }

    public function show(JournalVoucher $journalVoucher)
    {
        return response()->json($journalVoucher);
    }

    public function update(Request $request, JournalVoucher $journalVoucher)
    {
        $journalVoucher->update($request->all());
        return response()->json($journalVoucher);
    }

    public function destroy(JournalVoucher $journalVoucher)
    {
        $journalVoucher->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
