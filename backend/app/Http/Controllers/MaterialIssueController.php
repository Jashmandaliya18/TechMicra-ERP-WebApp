<?php

namespace App\Http\Controllers;

use App\Models\MaterialIssue;
use Illuminate\Http\Request;

class MaterialIssueController extends Controller
{
    public function index()
    {
        return response()->json(MaterialIssue::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'issue_id' => 'required|string',
            'route_card_ref' => 'required|string',
            'item' => 'required|string',
            'qty_requested' => 'required|integer',
            'qty_issued' => 'required|integer',
            'issued_date' => 'required|date',
        ]);

        $issue = MaterialIssue::create($validated);
        return response()->json($issue, 201);
    }
}
