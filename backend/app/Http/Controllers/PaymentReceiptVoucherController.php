<?php

namespace App\Http\Controllers;

use App\Models\PaymentReceiptVoucher;
use Illuminate\Http\Request;

class PaymentReceiptVoucherController extends Controller
{
    public function index()
    {
        return response()->json(
            PaymentReceiptVoucher::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'voucher_type' => 'nullable|string',
            'date'         => 'nullable|date',
            'party_name'   => 'nullable|string',
            'amount'       => 'nullable|numeric|min:0',
            'mode'         => 'nullable|string',
            'reference_no' => 'nullable|string',
            'remarks'      => 'nullable|string',
        ]);

        return response()->json(PaymentReceiptVoucher::create($validated), 201);
    }

    public function show(PaymentReceiptVoucher $paymentReceiptVoucher)
    {
        return response()->json($paymentReceiptVoucher);
    }

    public function update(Request $request, PaymentReceiptVoucher $paymentReceiptVoucher)
    {
        $paymentReceiptVoucher->update($request->all());
        return response()->json($paymentReceiptVoucher);
    }

    public function destroy(PaymentReceiptVoucher $paymentReceiptVoucher)
    {
        $paymentReceiptVoucher->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
