<?php

namespace App\Http\Controllers;

use App\Models\MonthlySalarySheet;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    public function index()
    {
        return response()->json(MonthlySalarySheet::with('employee')->orderBy('year', 'desc')->orderBy('month', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
            'total_days' => 'required|integer|min:1',
            'present_days' => 'required|integer|min:0',
            'calculated_gross' => 'required|numeric|min:0',
            'deductions' => 'required|numeric|min:0',
            'net_pay' => 'required|numeric|min:0',
            'payment_status' => 'required|in:Pending,Paid'
        ]);

        $payroll = MonthlySalarySheet::create($validated);
        return response()->json($payroll->load('employee'), 201);
    }

    public function show($id)
    {
        $payroll = MonthlySalarySheet::with('employee')->findOrFail($id);
        return response()->json($payroll);
    }

    public function update(Request $request, $id)
    {
        $payroll = MonthlySalarySheet::findOrFail($id);
        
        $validated = $request->validate([
            'total_days' => 'required|integer|min:1',
            'present_days' => 'required|integer|min:0',
            'calculated_gross' => 'required|numeric|min:0',
            'deductions' => 'required|numeric|min:0',
            'net_pay' => 'required|numeric|min:0',
            'payment_status' => 'required|in:Pending,Paid'
        ]);

        $payroll->update($validated);
        return response()->json($payroll->load('employee'));
    }

    public function destroy($id)
    {
        $payroll = MonthlySalarySheet::findOrFail($id);
        $payroll->delete();
        return response()->json(null, 204);
    }
}
