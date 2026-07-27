<?php

use App\Http\Controllers\ToolController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tools', [ToolController::class, 'index']);
    Route::get('/tools/search', [ToolController::class, 'search']);
    Route::post('/tools', [ToolController::class, 'store']);
});
