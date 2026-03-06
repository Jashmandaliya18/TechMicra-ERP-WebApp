<?php

namespace App\Http\Controllers;

use App\Models\JobOrder;
use Illuminate\Http\Request;

class JobOrderController extends Controller
{
    public function index()
    {
        return response()->json(JobOrder::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_order_no' => 'required|string',
            'contractor' => 'required|string',
            'item_sent' => 'required|string',
            'process_required' => 'required|string',
            'rate' => 'required|numeric',
        ]);

        $order = JobOrder::create($validated);
        return response()->json($order, 201);
    }
}
