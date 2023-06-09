<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;

Route::get('/', [UploadController::class, 'showForm'])->name('showUploadForm');
Route::post('/upload', [UploadController::class, 'processUpload'])->name('processUpload');
Route::get('data/data_list', [UploadController::class,'dataListShow']);
