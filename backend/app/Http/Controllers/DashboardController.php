<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        // General Super Admin Stats
        $totalSales = DB::table('invoices')->sum('grand_total') ?? 0;
        $pendingOrders = DB::table('sale_orders')->where('status', 'Pending')->count();
        $lowStockItems = DB::table('products')->where('current_stock', '<=', 10)->count(); // Example threshold
        $pendingPOs = Schema::hasTable('purchase_orders') ? DB::table('purchase_orders')->where('status', 'Pending')->count() : 0;
        $runningBatches = Schema::hasTable('routecards') ? DB::table('routecards')->count() : 0;
        $dispatchPending = Schema::hasTable('dispatch_advice') ? DB::table('dispatch_advice')->count() : 0;
        $totalEmployees = Schema::hasTable('employees') ? DB::table('employees')->count() : 0;
        // Finance & Payment Stats
        $pendingPayments = Schema::hasTable('payment_receipt_vouchers') 
            ? DB::table('payment_receipt_vouchers')->where('voucher_type', 'payment')->sum('amount') 
            : 0;
        
        $cashFlow = Schema::hasTable('payment_receipt_vouchers')
            ? DB::table('payment_receipt_vouchers')->where('voucher_type', 'receipt')->sum('amount')
            : 0;

        // Sales Dashboard Specific Stats
        $newInquiries = Schema::hasTable('inquiries') ? DB::table('inquiries')->where('status', 'Open')->count() : 0;
        $pendingQuotations = Schema::hasTable('quotations') ? DB::table('quotations')->count() : 0;
        $ordersConfirmed = DB::table('sale_orders')->where('status', '!=', 'Pending')->count();
        $invoicesGenerated = DB::table('invoices')->count();
        $overduePayments = 0; // Placeholder

        return response()->json([
            // Super Admin
            'totalSales' => $totalSales,
            'pendingOrders' => $pendingOrders,
            'lowStockItems' => $lowStockItems,
            'pendingPOs' => $pendingPOs,
            'runningBatches' => $runningBatches,
            'dispatchPending' => $dispatchPending,
            'totalEmployees' => $totalEmployees,
            'pendingPayments' => $pendingPayments,
            'cashFlow' => $cashFlow,
            'notifications' => 0,
            
            // Sales Role
            'newInquiries' => $newInquiries,
            'pendingQuotations' => $pendingQuotations,
            'ordersConfirmed' => $ordersConfirmed,
            'invoicesGenerated' => $invoicesGenerated,
            'overduePayments' => $overduePayments,

            // Purchase Role
            'openIndents' => Schema::hasTable('material_indents') ? DB::table('material_indents')->whereIn('status', ['Pending', 'Open'])->count() : 0,
            'pendingPurchaseOrders' => $pendingPOs,
            'todaysDeliveries' => Schema::hasTable('goods_receipt_notes') ? DB::table('goods_receipt_notes')->whereDate('created_at', now()->toDateString())->count() : 0,
            'duePaymentsAmount' => Schema::hasTable('purchase_billbooks') ? DB::table('purchase_billbooks')->sum('total_amount') : 0
        ]);
    }
}
