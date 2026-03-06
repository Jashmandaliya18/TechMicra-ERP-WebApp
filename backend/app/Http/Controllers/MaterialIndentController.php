<?php

namespace App\Http\Controllers;

use App\Models\MaterialIndent;
use Illuminate\Http\Request;

class MaterialIndentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return MaterialIndent::with('items.product')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_date' => 'required|date',
            'department' => 'required|string',
            'priority' => 'required|string',
            'items' => 'required|array',
            'items.*.item_name' => 'required|string',
            'items.*.requested_qty' => 'required|integer|min:1',
            'items.*.current_stock' => 'nullable|integer',
        ]);

        // Auto-generate Indent No
        $count = MaterialIndent::whereDate('created_at', now())->count() + 1;
        $indentNo = 'IND-' . now()->format('Ymd') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $indent = MaterialIndent::create([
            'indent_no' => $indentNo,
            'request_date' => $validated['request_date'],
            'department' => $validated['department'],
            'priority' => $validated['priority'],
            'status' => 'Pending',
            'requested_by' => auth()->id() ?? 1,
        ]);

        foreach ($validated['items'] as $item) {
            $indent->items()->create($item);
        }

        return response()->json($indent->load('items'), 201);
    }

    public function show(MaterialIndent $materialIndent)
    {
        return $materialIndent->load('items.product');
    }

    public function update(Request $request, MaterialIndent $materialIndent)
    {
        $validated = $request->validate([
            'request_date' => 'sometimes|date',
            'department' => 'sometimes|string',
            'priority' => 'sometimes|string|in:Low,Medium,High',
            'items' => 'sometimes|array',
            'items.*.id' => 'sometimes|exists:material_indent_items,id',
            'items.*.item_name' => 'required_with:items|string',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.requested_qty' => 'required_with:items|integer|min:1',
            'items.*.current_stock' => 'nullable|integer',
        ]);

        $materialIndent->update($request->only(['request_date', 'department', 'priority']));

        if (isset($validated['items'])) {
            // Simple approach: delete and recreate for now, or handle updates
            $materialIndent->items()->delete();
            foreach ($validated['items'] as $item) {
                $materialIndent->items()->create($item);
            }
        }

        return response()->json($materialIndent->load('items.product'));
    }

    public function destroy(MaterialIndent $materialIndent)
    {
        $materialIndent->delete();
        return response()->json(null, 204);
    }
}
