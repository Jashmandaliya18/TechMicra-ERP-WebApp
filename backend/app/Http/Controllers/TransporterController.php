<?php

namespace App\Http\Controllers;

use App\Models\Transporter;
use Illuminate\Http\Request;

class TransporterController extends Controller
{
    public function index()
    {
        return response()->json(Transporter::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'contact_person'=> 'nullable|string|max:255',
            'phone'         => 'nullable|string|max:20',
            'email'         => 'nullable|email|max:255',
            'address'       => 'nullable|string',
            'gst_no'        => 'nullable|string|max:20',
            'vehicle_types' => 'nullable|string|max:255',
            'is_active'     => 'boolean',
        ]);

        $transporter = Transporter::create($validated);

        return response()->json($transporter, 201);
    }

    public function show(Transporter $transporter)
    {
        return response()->json($transporter);
    }

    public function update(Request $request, Transporter $transporter)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'contact_person'=> 'nullable|string|max:255',
            'phone'         => 'nullable|string|max:20',
            'email'         => 'nullable|email|max:255',
            'address'       => 'nullable|string',
            'gst_no'        => 'nullable|string|max:20',
            'vehicle_types' => 'nullable|string|max:255',
            'is_active'     => 'boolean',
        ]);

        $transporter->update($validated);

        return response()->json($transporter);
    }

    public function destroy(Transporter $transporter)
    {
        $transporter->delete();
        return response()->json(['message' => 'Transporter deleted']);
    }
}
