<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        return response()->json(Employee::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_code' => 'required|string|unique:employees,employee_code',
            'name' => 'required|string|max:255',
            'department' => 'nullable|string',
            'designation' => 'nullable|string',
            'mobile' => 'nullable|string',
            'date_of_joining' => 'required|date',
            'basic_salary' => 'required|numeric|min:0',
            'bank_details' => 'nullable|string',
            'status' => 'required|in:Active,On-Leave,Terminated'
        ]);

        $employee = Employee::create($validated);
        return response()->json($employee, 201);
    }

    public function show(Employee $employee)
    {
        return response()->json($employee->load(['salaryStructure', 'payrollRecords', 'advanceRecords']));
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'employee_code' => 'required|string|unique:employees,employee_code,' . $employee->id,
            'name' => 'required|string|max:255',
            'department' => 'nullable|string',
            'designation' => 'nullable|string',
            'mobile' => 'nullable|string',
            'date_of_joining' => 'required|date',
            'basic_salary' => 'required|numeric|min:0',
            'bank_details' => 'nullable|string',
            'status' => 'required|in:Active,On-Leave,Terminated'
        ]);

        $employee->update($validated);
        return response()->json($employee);
    }

    public function destroy(Employee $employee)
    {
        \Illuminate\Support\Facades\DB::transaction(function () use ($employee) {
            $employee->salaryStructure()->delete();
            $employee->payrollRecords()->delete();
            $employee->advanceRecords()->delete();
            $employee->delete();
        });

        return response()->json(null, 204);
    }
}
