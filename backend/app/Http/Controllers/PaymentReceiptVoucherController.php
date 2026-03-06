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
            PaymentReceiptVoucher::with(['customer', 'invoice'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'voucher_date' => 'required|date',
            'customer_id'  => 'required|exists:customers,id',
            'invoice_id'   => 'nullable|exists:invoices,id',
            'amount'       => 'required|numeric|min:0',
            'mode'         => 'required|in:Cheque,NEFT,RTGS,Cash,UPI',
            'ref_no'       => 'nullable|string|max:100',
        ]);

        $voucher = PaymentReceiptVoucher::create([
            'receipt_no'   => $this->nextReceiptNo(),
            'voucher_date' => $data['voucher_date'],
            'customer_id'  => $data['customer_id'],
            'invoice_id'   => $data['invoice_id'] ?? null,
            'amount'       => $data['amount'],
            'mode'         => $data['mode'],
            'ref_no'       => $data['ref_no'] ?? null,
        ]);

        $voucher->load(['customer', 'invoice']);
        return response()->json($voucher, 201);
    }

    public function show(PaymentReceiptVoucher $paymentReceiptVoucher)
    {
        return response()->json($paymentReceiptVoucher->load(['customer', 'invoice']));
    }

    public function update(Request $request, PaymentReceiptVoucher $paymentReceiptVoucher)
    {
        $data = $request->validate([
            'voucher_date' => 'required|date',
            'customer_id'  => 'required|exists:customers,id',
            'invoice_id'   => 'nullable|exists:invoices,id',
            'amount'       => 'required|numeric|min:0',
            'mode'         => 'required|in:Cheque,NEFT,RTGS,Cash,UPI',
            'ref_no'       => 'nullable|string|max:100',
        ]);

        $paymentReceiptVoucher->update($data);
        return response()->json($paymentReceiptVoucher->load(['customer', 'invoice']));
    }

    public function destroy(PaymentReceiptVoucher $paymentReceiptVoucher)
    {
        $paymentReceiptVoucher->delete();
        return response()->json(['message' => 'Voucher deleted successfully.']);
    }
}
