<?php

namespace App\Http\Controllers;

use App\Models\QualityRejectionDisposal;
use Illuminate\Http\Request;

class QualityRejectionDisposalController extends Controller
{
    public function index()
    {
        return QualityRejectionDisposal::with(['product', 'user'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rejected_qty' => 'required|integer|min:1',
            'source' => 'required|in:IQC,PQC,PDI,Customer Return',
            'disposal_action' => 'required|in:Scrap,Return,Rework,Downgrade',
            'reason' => 'required|string',
            'disposed_by' => 'required|exists:users,id',
            'disposal_date' => 'required|date',
        ]);

        $validated['qrd_no'] = 'QRD-' . date('Ym') . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);

        $qrd = QualityRejectionDisposal::create($validated);
        return response()->json($qrd->load(['product', 'user']), 201);
    }

    public function show(QualityRejectionDisposal $qualityRejectionDisposal)
    {
        return $qualityRejectionDisposal->load(['product', 'user']);
    }

    public function update(Request $request, QualityRejectionDisposal $qualityRejectionDisposal)
    {
        $validated = $request->validate([
            'disposal_action' => 'sometimes|in:Scrap,Return,Rework,Downgrade',
            'reason' => 'sometimes|string',
        ]);

        $qualityRejectionDisposal->update($validated);
        return response()->json($qualityRejectionDisposal->load(['product', 'user']));
    }

    public function destroy(QualityRejectionDisposal $qualityRejectionDisposal)
    {
        $qualityRejectionDisposal->delete();
        return response()->json(null, 204);
    }
}
