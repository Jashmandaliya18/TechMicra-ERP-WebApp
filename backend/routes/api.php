<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Logistics
    Route::apiResource('transporters', \App\Http\Controllers\TransporterController::class);
    Route::apiResource('logistics-bookings', \App\Http\Controllers\LogisticsBookingController::class);
    Route::apiResource('delivery-challans', \App\Http\Controllers\DeliveryChallanController::class);
    Route::apiResource('freight-billbooks', \App\Http\Controllers\FreightBillbookController::class);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
