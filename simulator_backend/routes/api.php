<?php

use App\Http\Controllers\testController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\PresetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/app', [testController::class,'index'] );


Route::prefix('devices')->group(function () {
    Route::get('/', [DeviceController::class, 'index']); 
    Route::post('/', [DeviceController::class, 'store']); 
    Route::delete('/', [DeviceController::class, 'destroyAll']); 
    Route::get('/{id}', [DeviceController::class, 'show']); 
    Route::put('/{id}', [DeviceController::class, 'update']); 
    Route::delete('/{id}', [DeviceController::class, 'destroy']); 
});


Route::prefix('presets')->group(function () {
    Route::get('/', [PresetController::class, 'index']); 
    Route::post('/', [PresetController::class, 'store']); 
    Route::get('/{id}', [PresetController::class, 'show']); 
    Route::put('/{id}', [PresetController::class, 'update']); 
    Route::delete('/{id}', [PresetController::class, 'destroy']); 
    Route::get('/{id}/load', [PresetController::class, 'load']); 
});
