<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
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
use App\Http\Controllers\ToolController;
use App\Http\Controllers\ToolMaintenanceController;
use App\Http\Controllers\ToolCalibrationController;
use App\Http\Controllers\ToolRepairController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Production Management Module Routes
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

    // Maintenance Management Module Routes
    Route::apiResource('tools', ToolController::class);
    Route::apiResource('tool-maintenance', ToolMaintenanceController::class);
    Route::apiResource('tool-calibration', ToolCalibrationController::class);
    Route::apiResource('tool-repairs', ToolRepairController::class);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
