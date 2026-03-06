<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        return response()->json([
            'totalSales' => DB::table('invoices')->sum('grand_total') ?? 0,
            'pendingOrders' => DB::table('sale_orders')->count(),
            'lowStockItems' => 0,
            'pendingPOs' => DB::table('purchase_orders')->count(),
            'runningBatches' => DB::table('routecards')->count(),
            'dispatchPending' => 0,
            'totalEmployees' => DB::table('employees')->count(),
            'pendingPayments' => 0,
            'cashFlow' => 0,
            'notifications' => 0
        ]);
    }
}
