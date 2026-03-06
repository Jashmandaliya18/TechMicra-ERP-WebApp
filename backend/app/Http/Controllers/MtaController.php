<?php

namespace App\Http\Controllers;

use App\Models\Mta;
use Illuminate\Http\Request;

class MtaController extends Controller
{
    public function index()
    {
        return response()->json(Mta::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mta_no' => 'required|string',
            'from_department' => 'required|string',
            'to_department' => 'required|string',
            'item' => 'required|string',
            'qty' => 'required|integer',
            'received_by' => 'required|string',
            'transfer_date' => 'required|date',
        ]);

        $mta = Mta::create($validated);
        return response()->json($mta, 201);
    }
}
