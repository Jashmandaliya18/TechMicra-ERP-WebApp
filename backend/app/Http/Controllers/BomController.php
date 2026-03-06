<?php

namespace App\Http\Controllers;

use App\Models\Bom;
use Illuminate\Http\Request;

class BomController extends Controller
{
    public function index()
    {
        return response()->json(Bom::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'finished_good' => 'required|string',
            'process_name' => 'required|string',
            'machine' => 'required|string',
            'raw_material_input' => 'required|string',
            'output_qty' => 'required|integer',
        ]);

        $bom = Bom::create($validated);
        return response()->json($bom, 201);
    }

    public function show($id)
    {
        return response()->json(Bom::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $bom = Bom::findOrFail($id);
        
        $validated = $request->validate([
            'finished_good' => 'sometimes|string',
            'process_name' => 'sometimes|string',
            'machine' => 'sometimes|string',
            'raw_material_input' => 'sometimes|string',
            'output_qty' => 'sometimes|integer',
        ]);

        $bom->update($validated);
        return response()->json($bom);
    }

    public function destroy($id)
    {
        Bom::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
