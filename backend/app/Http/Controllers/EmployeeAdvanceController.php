<?php

namespace App\Http\Controllers;

use App\Models\EmployeeAdvanceLoan;
use Illuminate\Http\Request;

class EmployeeAdvanceController extends Controller
{
    public function index()
    {
        return response()->json(EmployeeAdvanceLoan::with('employee')->orderBy('loan_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'memo_no' => 'required|string|unique:employee_advance_loans,memo_no',
            'employee_id' => 'required|exists:employees,id',
            'loan_date' => 'required|date',
            'amount' => 'required|numeric|min:1',
            'installments_months' => 'required|integer|min:1',
            'deduction_per_month' => 'required|numeric|min:0',
            'remaining_amount' => 'required|numeric|min:0',
            'purpose' => 'nullable|string',
            'recovery_month' => 'nullable|string',
            'remarks' => 'nullable|string'
        ]);

        $loan = EmployeeAdvanceLoan::create($validated);
        return response()->json($loan->load('employee'), 201);
    }

    public function show($id)
    {
        $loan = EmployeeAdvanceLoan::with('employee')->findOrFail($id);
        return response()->json($loan);
    }

    public function update(Request $request, $id)
    {
        $loan = EmployeeAdvanceLoan::findOrFail($id);

        $validated = $request->validate([
            'loan_date' => 'required|date',
            'amount' => 'required|numeric|min:1',
            'installments_months' => 'required|integer|min:1',
            'deduction_per_month' => 'required|numeric|min:0',
            'remaining_amount' => 'required|numeric|min:0',
            'purpose' => 'nullable|string',
            'recovery_month' => 'nullable|string',
            'remarks' => 'nullable|string'
        ]);

        $loan->update($validated);
        return response()->json($loan->load('employee'));
    }

    public function destroy($id)
    {
        $loan = EmployeeAdvanceLoan::findOrFail($id);
        $loan->delete();
        return response()->json(null, 204);
    }
}
