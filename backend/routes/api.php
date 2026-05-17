<?php

use App\Http\Controllers\Api\AIDesignController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DesignController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/public/products', [\App\Http\Controllers\Api\ListedProductController::class, 'publicCatalog']);
Route::get('/public/products/{listedProduct}', [\App\Http\Controllers\Api\ListedProductController::class, 'publicShow']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('jwt.auth')->group(function (): void {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'update']);
    
    // Protected Stripe Payments and Customer Orders
    Route::post('/payments/create-intent', [\App\Http\Controllers\Api\StripePaymentController::class, 'createPaymentIntent']);
    Route::post('/payments/confirm', [\App\Http\Controllers\Api\StripePaymentController::class, 'confirmPayment']);
    Route::get('/payments/orders', [\App\Http\Controllers\Api\StripePaymentController::class, 'customerOrders']);

    Route::get('/sales', [\App\Http\Controllers\Api\ListedProductController::class, 'sales']);

    // Notification Center
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::patch('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    Route::patch('/notifications/{notification}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);

    Route::post('/product/upload', [ProductController::class, 'upload']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);


    Route::post('/design/save', [DesignController::class, 'save']);
    Route::get('/designs', [DesignController::class, 'index']);
    Route::delete('/design/{design}', [DesignController::class, 'destroy']);

    Route::post('/marketplace/products', [\App\Http\Controllers\Api\ListedProductController::class, 'store']);
    Route::get('/marketplace/products', [\App\Http\Controllers\Api\ListedProductController::class, 'index']);
    Route::post('/marketplace/products/{listedProduct}/purchase', [\App\Http\Controllers\Api\ListedProductController::class, 'mockPurchase']);
    Route::put('/marketplace/products/{listedProduct}', [\App\Http\Controllers\Api\ListedProductController::class, 'update']);

    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/pending-products', [\App\Http\Controllers\Api\AdminController::class, 'pendingProducts']);
        Route::patch('/products/{listedProduct}/status', [\App\Http\Controllers\Api\AdminController::class, 'updateProductStatus']);
        Route::get('/sellers', [\App\Http\Controllers\Api\AdminController::class, 'sellers']);
        Route::get('/sellers/{seller}/designs', [\App\Http\Controllers\Api\AdminController::class, 'sellerDesigns']);
        Route::get('/sales', [\App\Http\Controllers\Api\AdminController::class, 'sales']);
        Route::patch('/sales/{sale}/status', [\App\Http\Controllers\Api\AdminController::class, 'updateSaleStatus']);
    });
});
