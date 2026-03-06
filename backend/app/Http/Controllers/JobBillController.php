<?php

namespace App\Http\Controllers;

use App\Models\JobBill;
use Illuminate\Http\Request;

class JobBillController extends Controller
{
    public function index()
    {
        return response()->json(JobBill::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bill_no' => 'required|string',
            'job_order_ref' => 'required|string',
            'labor_charges' => 'required|numeric',
            'gst' => 'required|numeric',
            'total_amount' => 'required|numeric',
        ]);

        $bill = JobBill::create($validated);
        return response()->json($bill, 201);
    }
}
