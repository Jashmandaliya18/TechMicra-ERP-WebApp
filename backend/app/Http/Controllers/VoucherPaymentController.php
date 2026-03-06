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
        return VoucherPayment::with(['vendor', 'purchaseBillbook'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'voucher_no' => 'required|string|unique:voucher_payments',
            'vendor_id' => 'required|exists:vendors,id',
            'purchase_billbook_id' => 'nullable|exists:purchase_billbooks,id',
            'payment_date' => 'required|date',
            'bank_account' => 'nullable|string',
            'amount_paid' => 'required|numeric|min:0',
            'payment_mode' => 'required|string',
            'tds_percent' => 'nullable|numeric|min:0|max:100',
            'remarks' => 'nullable|string',
        ]);

        $payment = VoucherPayment::create($validated);
        return response()->json($payment->load(['vendor', 'purchaseBillbook']), 201);
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
