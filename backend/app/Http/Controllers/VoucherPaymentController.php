<?php

namespace App\Http\Controllers;

use App\Models\VoucherPayment;
use Illuminate\Http\Request;

class VoucherPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return VoucherPayment::with(['billbook'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor' => 'required|string',
            'vendor_id' => 'nullable|exists:vendors,id',
            'billbook_id' => 'required|exists:purchase_billbooks,id',
            'payment_date' => 'required|date',
            'bank_account' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
        ]);

        // Auto-generate Voucher No
        $count = VoucherPayment::whereDate('created_at', now())->count() + 1;
        $voucherNo = 'VOU-' . now()->format('Ymd') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $payment = VoucherPayment::create(array_merge($validated, ['voucher_no' => $voucherNo]));
        return response()->json($payment->load(['billbook']), 201);
    }

    public function show(VoucherPayment $voucherPayment)
    {
        return $voucherPayment->load(['vendor', 'purchaseBillbook']);
    }

    public function update(Request $request, VoucherPayment $voucherPayment)
    {
        $validated = $request->validate([
            'payment_date' => 'sometimes|date',
            'bank_account' => 'nullable|string',
            'amount_paid' => 'sometimes|numeric|min:0',
            'payment_mode' => 'sometimes|string',
            'tds_percent' => 'nullable|numeric|min:0|max:100',
            'remarks' => 'nullable|string',
        ]);

        $voucherPayment->update($validated);
        return response()->json($voucherPayment->load(['vendor', 'purchaseBillbook']));
    }

    public function destroy(VoucherPayment $voucherPayment)
    {
        $voucherPayment->delete();
        return response()->json(null, 204);
    }
}
