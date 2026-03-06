<?php

namespace App\Http\Controllers;

use App\Models\RouteCard;
use Illuminate\Http\Request;

class RouteCardController extends Controller
{
    public function index()
    {
        return response()->json(RouteCard::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'route_card_no' => 'required|string',
            'batch_no' => 'required|string',
            'product' => 'required|string',
            'plan_qty' => 'required|integer',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'status' => 'required|in:planned,in_progress,completed',
        ]);

        $routeCard = RouteCard::create($validated);
        return response()->json($routeCard, 201);
    }

    public function show($id)
    {
        return response()->json(RouteCard::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $routeCard = RouteCard::findOrFail($id);
        
        $validated = $request->validate([
            'route_card_no' => 'sometimes|string',
            'batch_no' => 'sometimes|string',
            'product' => 'sometimes|string',
            'plan_qty' => 'sometimes|integer',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
            'status' => 'sometimes|in:planned,in_progress,completed',
        ]);

        $routeCard->update($validated);
        return response()->json($routeCard);
    }
}
