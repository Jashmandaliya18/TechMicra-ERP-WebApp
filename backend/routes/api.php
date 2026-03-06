<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Sales
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\SaleOrderController;
use App\Http\Controllers\DispatchAdviceController;
use App\Http\Controllers\InvoiceController;

// Stores
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\WarehouseOpeningController;
use App\Http\Controllers\DispatchSrvController;
use App\Http\Controllers\WarehouseTransferController;
use App\Http\Controllers\WarehouseReceiptController;

// Production
use App\Http\Controllers\BomController;
use App\Http\Controllers\RouteCardController;
use App\Http\Controllers\MaterialIssueController;
use App\Http\Controllers\MtaController;
use App\Http\Controllers\ProductionReportController;
use App\Http\Controllers\JobOrderController;
use App\Http\Controllers\ChallanController;
use App\Http\Controllers\ExternalGrnController;
use App\Http\Controllers\JobBillController;
use App\Http\Controllers\RouteCardClosureController;

// Maintenance
use App\Http\Controllers\ToolController;
use App\Http\Controllers\ToolMaintenanceController;
use App\Http\Controllers\ToolCalibrationController;
use App\Http\Controllers\ToolRepairController;

// Finance
use App\Http\Controllers\JournalVoucherController;
use App\Http\Controllers\PaymentReceiptVoucherController;
use App\Http\Controllers\ContraVoucherController;
use App\Http\Controllers\GstJournalVoucherController;
use App\Http\Controllers\BankReconciliationController;
use App\Http\Controllers\CreditCardStatementController;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);

// Removed temporary DB setup route


Route::middleware(['auth:sanctum'])->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/user', fn(Request $r) => $r->user());

    // =========================================
    // SALES MODULE
    // =========================================
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('inquiries', InquiryController::class);
    Route::apiResource('quotations', QuotationController::class);
    Route::apiResource('sale-orders', SaleOrderController::class);
    Route::apiResource('dispatch-advice', DispatchAdviceController::class);
    Route::apiResource('invoices', InvoiceController::class);
    // Route::apiResource('voucher-receipts', PaymentReceiptVoucherController::class);

    // =========================================
    // PURCHASE MODULE
    // =========================================
    Route::apiResource('material-indents', \App\Http\Controllers\MaterialIndentController::class);
    Route::apiResource('purchase-orders', \App\Http\Controllers\PurchaseOrderController::class);
    Route::apiResource('purchase-schedules', \App\Http\Controllers\PurchaseScheduleController::class);
    Route::apiResource('goods-receipt-notes', \App\Http\Controllers\GoodsReceiptNoteController::class);
    Route::apiResource('iqc-checks', \App\Http\Controllers\IqcCheckController::class);
    Route::apiResource('material-receipts', \App\Http\Controllers\MaterialReceiptController::class);
    Route::apiResource('purchase-billbooks', \App\Http\Controllers\PurchaseBillbookController::class);
    Route::apiResource('voucher-payments', \App\Http\Controllers\VoucherPaymentController::class);

    // =========================================
    // STORES MODULE
    // =========================================
    Route::apiResource('warehouses', WarehouseController::class);
    Route::apiResource('warehouse-openings', WarehouseOpeningController::class);
    Route::apiResource('dispatch-srvs', DispatchSrvController::class);
    Route::apiResource('warehouse-transfers', WarehouseTransferController::class);
    Route::apiResource('warehouse-receipts', WarehouseReceiptController::class);

    // =========================================
    // QUALITY MODULE
    // =========================================
    Route::apiResource('incoming-quality-controls', \App\Http\Controllers\IncomingQualityControlController::class);
    Route::apiResource('material-transfer-slips', \App\Http\Controllers\MaterialTransferSlipController::class);
    Route::apiResource('process-quality-controls', \App\Http\Controllers\ProcessQualityControlController::class);
    Route::apiResource('pre-dispatch-inspections', \App\Http\Controllers\PreDispatchInspectionController::class);
    Route::apiResource('quality-rejection-disposals', \App\Http\Controllers\QualityRejectionDisposalController::class);

    // =========================================
    // ASSETS MODULE
    // =========================================
    Route::apiResource('asset-masters', \App\Http\Controllers\AssetMasterController::class);
    Route::apiResource('asset-additions', \App\Http\Controllers\AssetAdditionController::class);
    Route::apiResource('asset-allocations', \App\Http\Controllers\AssetAllocationController::class);
    Route::apiResource('asset-sales', \App\Http\Controllers\AssetSaleController::class);
    Route::apiResource('asset-depreciations', \App\Http\Controllers\AssetDepreciationController::class);

    // =========================================
    // LOGISTICS MODULE
    // =========================================
    Route::apiResource('transporters', \App\Http\Controllers\TransporterController::class);
    Route::apiResource('logistics-bookings', \App\Http\Controllers\LogisticsBookingController::class);
    Route::apiResource('delivery-challans', \App\Http\Controllers\DeliveryChallanController::class);
    Route::apiResource('freight-billbooks', \App\Http\Controllers\FreightBillbookController::class);

    // =========================================
    // PRODUCTION MODULE
    // =========================================
    Route::apiResource('bom', BomController::class);
    Route::apiResource('routecards', RouteCardController::class);
    Route::apiResource('material-issues', MaterialIssueController::class)->only(['index', 'store']);
    Route::apiResource('mta', MtaController::class)->only(['index', 'store']);
    Route::apiResource('production-reports', ProductionReportController::class)->only(['index', 'store']);
    Route::apiResource('job-orders', JobOrderController::class)->only(['index', 'store']);
    Route::apiResource('challans', ChallanController::class)->only(['index', 'store']);
    Route::apiResource('external-grn', ExternalGrnController::class)->only(['index', 'store']);
    Route::apiResource('job-bills', JobBillController::class)->only(['index', 'store']);
    Route::post('routecard-close', [RouteCardClosureController::class, 'store']);

    // =========================================
    // MAINTENANCE MODULE
    // =========================================
    Route::apiResource('tools', ToolController::class);
    Route::apiResource('tool-maintenance', ToolMaintenanceController::class);
    Route::apiResource('tool-calibration', ToolCalibrationController::class);
    Route::apiResource('tool-repairs', ToolRepairController::class);

    // =========================================
    // FINANCE MODULE
    // =========================================
    Route::apiResource('journal-vouchers', JournalVoucherController::class);
    Route::apiResource('payment-receipts', PaymentReceiptVoucherController::class);
    Route::apiResource('contra-vouchers', ContraVoucherController::class);
    Route::apiResource('gst-journals', GstJournalVoucherController::class);
    Route::apiResource('bank-reconciliation', BankReconciliationController::class);
    Route::apiResource('credit-card-statements', CreditCardStatementController::class);
    // =========================================
    // HR MODULE
    // =========================================
    Route::apiResource('employees', \App\Http\Controllers\EmployeeController::class);
    Route::apiResource('salary-heads', \App\Http\Controllers\SalaryHeadController::class);
    Route::apiResource('salary-structures', \App\Http\Controllers\SalaryStructureController::class);
    Route::apiResource('payroll', \App\Http\Controllers\PayrollController::class);
    Route::apiResource('employee-advances', \App\Http\Controllers\EmployeeAdvanceController::class);

    // =========================================
    // CONTRACTORS MODULE
    // =========================================
    Route::apiResource('contractor-employees', \App\Http\Controllers\ContractorEmployeeController::class);
    Route::apiResource('contractor-salary-heads', \App\Http\Controllers\ContractorSalaryHeadController::class);
    Route::apiResource('contractor-salary-structures', \App\Http\Controllers\ContractorSalaryStructureController::class);
    Route::apiResource('contractor-salary-sheets', \App\Http\Controllers\ContractorSalarySheetController::class);
    Route::apiResource('contractor-advances', \App\Http\Controllers\ContractorAdvanceController::class);
    Route::apiResource('contractor-vouchers', \App\Http\Controllers\VoucherPaymentController::class);
});
