<?php

namespace App\Http\Controllers;

use App\Models\GstJournalVoucher;
use Illuminate\Http\Request;

class GstJournalVoucherController extends Controller
{
    public function index()
    {
        return response()->json(GstJournalVoucher::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date'            => 'required|date',
            'gst_ledger'      => 'nullable|string',
            'adjustment_type' => 'nullable|string',
            'amount'          => 'nullable|numeric',
            'remarks'         => 'nullable|string',
        ]);
        return response()->json(GstJournalVoucher::create($validated), 201);
    }

    public function show(GstJournalVoucher $gstJournalVoucher)
    {
        return response()->json($gstJournalVoucher);
    }

    public function update(Request $request, GstJournalVoucher $gstJournalVoucher)
    {
        $gstJournalVoucher->update($request->all());
        return response()->json($gstJournalVoucher);
    }

    public function destroy(GstJournalVoucher $gstJournalVoucher)
    {
        $gstJournalVoucher->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
