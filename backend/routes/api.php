<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\SaleOrderController;
use App\Http\Controllers\DispatchAdviceController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentReceiptVoucherController;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/user', fn(Request $r) => $r->user());

    // Quality
    Route::apiResource('incoming-quality-controls', \App\Http\Controllers\IncomingQualityControlController::class);
    Route::apiResource('material-transfer-slips', \App\Http\Controllers\MaterialTransferSlipController::class);
    Route::apiResource('process-quality-controls', \App\Http\Controllers\ProcessQualityControlController::class);
    Route::apiResource('pre-dispatch-inspections', \App\Http\Controllers\PreDispatchInspectionController::class);
    Route::apiResource('quality-rejection-disposals', \App\Http\Controllers\QualityRejectionDisposalController::class);

    // Logistics
    Route::apiResource('transporters', \App\Http\Controllers\TransporterController::class);
    Route::apiResource('logistics-bookings', \App\Http\Controllers\LogisticsBookingController::class);
    Route::apiResource('delivery-challans', \App\Http\Controllers\DeliveryChallanController::class);
    Route::apiResource('freight-billbooks', \App\Http\Controllers\FreightBillbookController::class);

    // =========================================
    // SALES MODULE
    // =========================================

    // Customer Master
    Route::apiResource('customers', CustomerController::class);

    // Product Master
    Route::apiResource('products', ProductController::class);

    // Inquiries
    Route::apiResource('inquiries', InquiryController::class);

    // Quotations
    Route::apiResource('quotations', QuotationController::class);

    // Sale Orders
    Route::apiResource('sale-orders', SaleOrderController::class);

    // Dispatch Advice
    Route::apiResource('dispatch-advice', DispatchAdviceController::class);

    // Invoices
    Route::apiResource('invoices', InvoiceController::class);

    // Voucher Receipts
    Route::apiResource('voucher-receipts', PaymentReceiptVoucherController::class);
});
