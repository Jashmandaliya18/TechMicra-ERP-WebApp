<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\Inquiry;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    private function nextQuoteId(): string
    {
        $prefix = 'QT-' . now()->format('Ym') . '-';
        $last = Quotation::where('quote_id', 'like', $prefix . '%')
            ->orderByDesc('quote_id')->first();
        $seq = $last ? ((int) substr($last->quote_id, -3)) + 1 : 1;
        return $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }

    public function index()
    {
        $quotations = Quotation::with(['inquiry.customer', 'items.product'])->latest()->get();
        return response()->json($quotations);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'inquiry_id'         => 'nullable|exists:inquiries,id',
            'valid_until'        => 'required|date',
            'payment_terms'      => 'nullable|string|max:255',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|numeric|min:0',
            'items.*.rate'       => 'required|numeric|min:0',
            'items.*.gst_percent'=> 'nullable|numeric|min:0|max:100',
        ]);

        $quotation = Quotation::create([
            'quote_id'     => $this->nextQuoteId(),
            'inquiry_id'   => $data['inquiry_id'] ?? null,
            'valid_until'  => $data['valid_until'],
            'payment_terms'=> $data['payment_terms'] ?? null,
        ]);

        foreach ($data['items'] as $item) {
            $gst = $item['gst_percent'] ?? 0;
            $total = $item['quantity'] * $item['rate'] * (1 + $gst / 100);
            QuotationItem::create([
                'quotation_id' => $quotation->id,
                'product_id'   => $item['product_id'],
                'quantity'     => $item['quantity'],
                'rate'         => $item['rate'],
                'gst_percent'  => $gst,
                'total'        => round($total, 2),
            ]);
        }

        // Mark inquiry as Quoted if linked
        if (!empty($data['inquiry_id'])) {
            Inquiry::where('id', $data['inquiry_id'])->update(['status' => 'Quoted']);
        }

        $quotation->load(['inquiry.customer', 'items.product']);
        return response()->json($quotation, 201);
    }

    public function show(Quotation $quotation)
    {
        return response()->json($quotation->load(['inquiry.customer', 'items.product']));
    }

    public function update(Request $request, Quotation $quotation)
    {
        $data = $request->validate([
            'inquiry_id'         => 'nullable|exists:inquiries,id',
            'valid_until'        => 'required|date',
            'payment_terms'      => 'nullable|string|max:255',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|numeric|min:0',
            'items.*.rate'       => 'required|numeric|min:0',
            'items.*.gst_percent'=> 'nullable|numeric|min:0|max:100',
        ]);

        $quotation->update([
            'inquiry_id'   => $data['inquiry_id'] ?? null,
            'valid_until'  => $data['valid_until'],
            'payment_terms'=> $data['payment_terms'] ?? null,
        ]);

        $quotation->items()->delete();
        foreach ($data['items'] as $item) {
            $gst = $item['gst_percent'] ?? 0;
            $total = $item['quantity'] * $item['rate'] * (1 + $gst / 100);
            QuotationItem::create([
                'quotation_id' => $quotation->id,
                'product_id'   => $item['product_id'],
                'quantity'     => $item['quantity'],
                'rate'         => $item['rate'],
                'gst_percent'  => $gst,
                'total'        => round($total, 2),
            ]);
        }

        return response()->json($quotation->load(['inquiry.customer', 'items.product']));
    }

    public function destroy(Quotation $quotation)
    {
        try {
            $quotation->items()->delete();
            $quotation->delete();
            return response()->json(['message' => 'Quotation deleted successfully.']);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == 23000 || $e->getCode() == 1451) {
                return response()->json(['error' => 'Cannot delete quotation because it has associated records.'], 400);
            }
            return response()->json(['error' => 'An error occurred while deleting the quotation.'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
}
