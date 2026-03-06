<?php

namespace App\Http\Controllers;

use App\Models\RouteCardClosure;
use Illuminate\Http\Request;

class RouteCardClosureController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'route_card_ref' => 'required|string',
            'final_fg_qty' => 'required|integer',
            'scrap_generated' => 'required|integer',
            'closure_date' => 'required|date',
        ]);

        $closure = RouteCardClosure::create($validated);
        return response()->json($closure, 201);
    }
}
