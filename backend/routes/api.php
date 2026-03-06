<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Purchase Management Module
    Route::apiResource('material-indents', \App\Http\Controllers\MaterialIndentController::class);
    Route::apiResource('purchase-orders', \App\Http\Controllers\PurchaseOrderController::class);
    Route::apiResource('purchase-schedules', \App\Http\Controllers\PurchaseScheduleController::class);
    Route::apiResource('goods-receipt-notes', \App\Http\Controllers\GoodsReceiptNoteController::class);
    Route::apiResource('incoming-quality-controls', \App\Http\Controllers\IqcCheckController::class);
    Route::apiResource('material-receipts', \App\Http\Controllers\MaterialReceiptController::class);
    Route::apiResource('purchase-billbooks', \App\Http\Controllers\PurchaseBillbookController::class);
    Route::apiResource('voucher-payments', \App\Http\Controllers\VoucherPaymentController::class);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
