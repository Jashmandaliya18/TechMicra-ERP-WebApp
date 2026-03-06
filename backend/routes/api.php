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
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\WarehouseOpeningController;
use App\Http\Controllers\DispatchSrvController;
use App\Http\Controllers\WarehouseTransferController;
use App\Http\Controllers\WarehouseReceiptController;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/user', fn(Request $r) => $r->user());

    // Purchase Management Module
    Route::apiResource('material-indents', \App\Http\Controllers\MaterialIndentController::class);
    Route::apiResource('purchase-orders', \App\Http\Controllers\PurchaseOrderController::class);
    Route::apiResource('purchase-schedules', \App\Http\Controllers\PurchaseScheduleController::class);
    Route::apiResource('goods-receipt-notes', \App\Http\Controllers\GoodsReceiptNoteController::class);
    Route::apiResource('iqc-checks', \App\Http\Controllers\IqcCheckController::class);
    Route::apiResource('material-receipts', \App\Http\Controllers\MaterialReceiptController::class);
    Route::apiResource('purchase-billbooks', \App\Http\Controllers\PurchaseBillbookController::class);
    Route::apiResource('voucher-payments', \App\Http\Controllers\VoucherPaymentController::class);

    // Stores Module
    Route::apiResource('warehouses', WarehouseController::class);
    Route::apiResource('warehouse-openings', WarehouseOpeningController::class);
    Route::apiResource('dispatch-srvs', DispatchSrvController::class);
    Route::apiResource('warehouse-transfers', WarehouseTransferController::class);
    Route::apiResource('warehouse-receipts', WarehouseReceiptController::class);

    // Quality
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
