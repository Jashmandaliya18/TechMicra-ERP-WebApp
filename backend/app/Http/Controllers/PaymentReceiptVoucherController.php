<?php

namespace App\Http\Controllers;

use App\Models\PaymentReceiptVoucher;
use Illuminate\Http\Request;

class PaymentReceiptVoucherController extends Controller
{
    private function nextReceiptNo(): string
    {
        $prefix = 'RCT-' . now()->format('Ym') . '-';
        $last = PaymentReceiptVoucher::where('receipt_no', 'like', $prefix . '%')
            ->orderByDesc('receipt_no')->first();
        $seq = $last ? ((int) substr($last->receipt_no, -3)) + 1 : 1;
        return $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }

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
            'voucher_date' => 'nullable|date',
            'date'         => 'nullable|date',
            'party_name'   => 'nullable|string',
            'customer_id'  => 'nullable|exists:customers,id',
            'invoice_id'   => 'nullable|exists:invoices,id',
            'amount'       => 'nullable|numeric|min:0',
            'mode'         => 'nullable|string',
            'reference_no' => 'nullable|string',
            'ref_no'       => 'nullable|string|max:100',
            'remarks'      => 'nullable|string',
        ]);

        // Auto-generate receipt_no if not provided
        if (empty($validated['receipt_no'])) {
            $validated['receipt_no'] = $this->nextReceiptNo();
        }

        return response()->json(PaymentReceiptVoucher::create($validated), 201);
    }

    public function show(PaymentReceiptVoucher $payment_receipt)
    {
        return response()->json($payment_receipt);
    }

    public function update(Request $request, PaymentReceiptVoucher $payment_receipt)
    {
        $payment_receipt->update($request->all());
        return response()->json($payment_receipt);
    }

    public function destroy(PaymentReceiptVoucher $payment_receipt)
    {
        $payment_receipt->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
