<?php

namespace App\Http\Controllers;

use App\Models\ProcessQualityControl;
use Illuminate\Http\Request;

class ProcessQualityControlController extends Controller
{
    public function index()
    {
        return ProcessQualityControl::with(['routecard', 'user'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'routecard_id' => 'required|exists:routecards,id',
            'operation_stage' => 'required|string',
            'sample_size' => 'required|integer|min:1',
            'accepted_qty' => 'required|integer|min:0',
            'rejected_qty' => 'required|integer|min:0',
            'result' => 'required|in:Pass,Fail,Conditional',
            'inspected_by' => 'required|exists:users,id',
            'inspection_date' => 'required|date',
            'remarks' => 'nullable|string',
        ]);

        $validated['pqc_no'] = 'PQC-' . date('Ym') . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);

        $pqc = ProcessQualityControl::create($validated);
        return response()->json($pqc->load(['routecard', 'user']), 201);
    }

    public function show(ProcessQualityControl $processQualityControl)
    {
        return $processQualityControl->load(['routecard', 'user']);
    }

    public function update(Request $request, ProcessQualityControl $processQualityControl)
    {
        $validated = $request->validate([
            'sample_size' => 'sometimes|integer|min:1',
            'accepted_qty' => 'sometimes|integer|min:0',
            'rejected_qty' => 'sometimes|integer|min:0',
            'result' => 'sometimes|in:Pass,Fail,Conditional',
            'remarks' => 'nullable|string',
        ]);

        $processQualityControl->update($validated);
        return response()->json($processQualityControl->load(['routecard', 'user']));
    }

    public function destroy(ProcessQualityControl $processQualityControl)
    {
        $processQualityControl->delete();
        return response()->json(null, 204);
    }
}
