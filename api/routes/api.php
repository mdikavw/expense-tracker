<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/sanctum/csrf-cookie', function ()
{
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function ()
{
    Route::get('/user', function ()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'User fetched successfully',
            'data' => Auth::user()
        ]);
    });

    Route::get('/expenses', [ExpenseController::class, 'index']);
    Route::get('/expenses-by-category', [ExpenseController::class, 'expenseByCategory']);
    Route::get('/monthly-comparison', [ExpenseController::class, 'monthlyComparison']);
    Route::get('/expenses/{expense}', [ExpenseController::class, 'show']);
    Route::put('/expenses/{expense}', [ExpenseController::class, 'update']);
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'delete']);
    Route::post('/expenses/create', [ExpenseController::class, 'store']);

    Route::get('/incomes', [IncomeController::class, 'index']);
    Route::get('/incomes/{income}', [IncomeController::class, 'show']);
    Route::put('/incomes/{income}', [IncomeController::class, 'update']);
    Route::delete('/incomes/{delete}', [IncomeController::class, 'delete']);
    Route::post('/incomes/create', [IncomeController::class, 'store']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/{user:username}/categories', [CategoryController::class, 'userCategories']);

    Route::post('/logout', [AuthController::class, 'logout']);
});
