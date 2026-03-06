<?php

namespace App\Http\Controllers;

use App\Models\DispatchSrv;
use Illuminate\Http\Request;

class DispatchSrvController extends Controller
{
    public function index()
    {
        return response()->json(DispatchSrv::with('product')->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'party_name' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'return_expected' => 'required|boolean',
            'return_expected_date' => 'nullable|date|after_or_equal:date',
        ]);

        $latest = DispatchSrv::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        $validated['srv_no'] = 'SRV-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        $srv = DispatchSrv::create($validated);
        return response()->json($srv, 201);
    }

    public function show($id)
    {
        $srv = DispatchSrv::with('product')->findOrFail($id);
        return response()->json($srv);
    }

    public function update(Request $request, $id)
    {
        $srv = DispatchSrv::findOrFail($id);
        $validated = $request->validate([
            'date' => 'required|date',
            'party_name' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'return_expected' => 'required|boolean',
            'return_expected_date' => 'nullable|date|after_or_equal:date',
        ]);

        $srv->update($validated);
        return response()->json($srv);
    }

    public function destroy($id)
    {
        $srv = DispatchSrv::findOrFail($id);
        $srv->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
