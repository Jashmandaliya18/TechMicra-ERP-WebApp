<?php

namespace App\Http\Controllers;

use App\Models\SalaryHead;
use Illuminate\Http\Request;

class SalaryHeadController extends Controller
{
    public function index()
    {
        return response()->json(SalaryHead::orderBy('head_name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'head_name' => 'required|string|max:255',
            'type' => 'required|in:Earning,Deduction',
            'is_active' => 'boolean'
        ]);

        $head = SalaryHead::create($validated);
        return response()->json($head, 201);
    }

    public function show(SalaryHead $salaryHead)
    {
        return response()->json($salaryHead);
    }

    public function update(Request $request, SalaryHead $salaryHead)
    {
        $validated = $request->validate([
            'head_name' => 'required|string|max:255',
            'type' => 'required|in:Earning,Deduction',
            'is_active' => 'boolean'
        ]);

        $salaryHead->update($validated);
        return response()->json($salaryHead);
    }

    public function destroy(SalaryHead $salaryHead)
    {
        $salaryHead->delete();
        return response()->json(null, 204);
    }
}
