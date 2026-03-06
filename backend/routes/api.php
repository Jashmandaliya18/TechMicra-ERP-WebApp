<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Quality
    Route::apiResource('incoming-quality-controls', \App\Http\Controllers\IncomingQualityControlController::class);
    Route::apiResource('material-transfer-slips', \App\Http\Controllers\MaterialTransferSlipController::class);
    Route::apiResource('process-quality-controls', \App\Http\Controllers\ProcessQualityControlController::class);
    Route::apiResource('pre-dispatch-inspections', \App\Http\Controllers\PreDispatchInspectionController::class);
    Route::apiResource('quality-rejection-disposals', \App\Http\Controllers\QualityRejectionDisposalController::class);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
