<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\WarehouseOpeningController;
use App\Http\Controllers\DispatchSrvController;
use App\Http\Controllers\WarehouseTransferController;
use App\Http\Controllers\WarehouseReceiptController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Stores Module
    Route::apiResource('warehouses', WarehouseController::class);
    Route::apiResource('warehouse-openings', WarehouseOpeningController::class);
    Route::apiResource('dispatch-srvs', DispatchSrvController::class);
    Route::apiResource('warehouse-transfers', WarehouseTransferController::class);
    Route::apiResource('warehouse-receipts', WarehouseReceiptController::class);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
