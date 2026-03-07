<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    private function nextInvoiceNo(): string
    {
        $prefix = 'INV-' . now()->format('Ym') . '-';
        $last = Invoice::where('invoice_no', 'like', $prefix . '%')
            ->orderByDesc('invoice_no')->first();
        $seq = $last ? ((int) substr($last->invoice_no, -3)) + 1 : 1;
        return $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }

    public function index()
    {
        return response()->json(
            Invoice::with(['saleOrder.customer'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sale_order_id'  => 'required|exists:sale_orders,id',
            'invoice_date'   => 'required|date',
            'place_of_supply'=> 'nullable|string|max:100',
            'e_way_bill_no'  => 'nullable|string|max:100',
            'taxable_value'  => 'required|numeric|min:0',
            'gst_amount'     => 'required|numeric|min:0',
            'round_off'      => 'nullable|numeric',
        ]);

        $grandTotal = $data['taxable_value'] + $data['gst_amount'] + ($data['round_off'] ?? 0);

        $invoice = Invoice::create([
            'invoice_no'     => $this->nextInvoiceNo(),
            'sale_order_id'  => $data['sale_order_id'],
            'invoice_date'   => $data['invoice_date'],
            'place_of_supply'=> $data['place_of_supply'] ?? null,
            'e_way_bill_no'  => $data['e_way_bill_no'] ?? null,
            'taxable_value'  => $data['taxable_value'],
            'gst_amount'     => $data['gst_amount'],
            'round_off'      => $data['round_off'] ?? 0,
            'grand_total'    => round($grandTotal, 2),
        ]);

        $invoice->load('saleOrder.customer');
        return response()->json($invoice, 201);
    }

    public function show(Invoice $invoice)
    {
        return response()->json($invoice->load('saleOrder.customer'));
    }

    public function update(Request $request, Invoice $invoice)
    {
        $data = $request->validate([
            'invoice_date'   => 'required|date',
            'place_of_supply'=> 'nullable|string|max:100',
            'e_way_bill_no'  => 'nullable|string|max:100',
            'taxable_value'  => 'required|numeric|min:0',
            'gst_amount'     => 'required|numeric|min:0',
            'round_off'      => 'nullable|numeric',
        ]);

        $data['grand_total'] = round(
            $data['taxable_value'] + $data['gst_amount'] + ($data['round_off'] ?? 0),
            2
        );

        $invoice->update($data);
        return response()->json($invoice->load('saleOrder.customer'));
    }

    public function destroy(Invoice $invoice)
    {
        try {
            $invoice->delete();
            return response()->json(['message' => 'Invoice deleted successfully.']);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == 23000 || $e->getCode() == 1451) {
                return response()->json(['error' => 'Cannot delete invoice because it has associated records.'], 400);
            }
            return response()->json(['error' => 'An error occurred while deleting the invoice.'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
}
