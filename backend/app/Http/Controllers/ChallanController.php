<?php

namespace App\Http\Controllers;

use App\Models\Challan;
use Illuminate\Http\Request;

class ChallanController extends Controller
{
    public function index()
    {
        return response()->json(Challan::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'challan_no' => 'required|string',
            'job_order_ref' => 'required|string',
            'item' => 'required|string',
            'qty' => 'required|integer',
            'vehicle_no' => 'required|string',
        ]);

        $challan = Challan::create($validated);
        return response()->json($challan, 201);
    }
}
