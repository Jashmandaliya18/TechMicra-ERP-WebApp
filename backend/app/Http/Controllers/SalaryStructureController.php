<?php

namespace App\Http\Controllers;

use App\Models\SalaryStructure;
use Illuminate\Http\Request;

class SalaryStructureController extends Controller
{
    public function index()
    {
        return response()->json(SalaryStructure::with('employee')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'effective_date' => 'nullable|date',
            'basic' => 'required|numeric|min:0',
            'hra' => 'required|numeric|min:0',
            'da' => 'required|numeric|min:0',
            'pf_percentage' => 'required|numeric|min:0',
            'other_allowances' => 'required|numeric|min:0',
        ]);

        $structure = SalaryStructure::updateOrCreate(
            ['employee_id' => $validated['employee_id']],
            $validated
        );

        return response()->json($structure->load('employee'), 201);
    }

    public function show(SalaryStructure $salaryStructure)
    {
        return response()->json($salaryStructure->load('employee'));
    }

    public function update(Request $request, SalaryStructure $salaryStructure)
    {
        $validated = $request->validate([
            'effective_date' => 'nullable|date',
            'basic' => 'required|numeric|min:0',
            'hra' => 'required|numeric|min:0',
            'da' => 'required|numeric|min:0',
            'pf_percentage' => 'required|numeric|min:0',
            'other_allowances' => 'required|numeric|min:0',
        ]);

        $salaryStructure->update($validated);
        return response()->json($salaryStructure->load('employee'));
    }

    public function destroy(SalaryStructure $salaryStructure)
    {
        $salaryStructure->delete();
        return response()->json(null, 204);
    }
}
