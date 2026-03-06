<?php

namespace App\Http\Controllers;

use App\Models\ExternalGrn;
use Illuminate\Http\Request;

class ExternalGrnController extends Controller
{
    public function index()
    {
        return response()->json(ExternalGrn::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'grn_no' => 'required|string',
            'challan_ref' => 'required|string',
            'received_qty' => 'required|integer',
            'passed_qty' => 'required|integer',
            'rejected_qty' => 'required|integer',
        ]);

        $grn = ExternalGrn::create($validated);
        return response()->json($grn, 201);
    }
}
