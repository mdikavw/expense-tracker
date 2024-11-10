<?php

namespace App\Http\Controllers;

use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IncomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $incomes = $user->incomes;

        return response()->json([
            'status' => 'success',
            'message' => 'Incomes retrieved successfully',
            'data' => $incomes
        ]);
    }

    public function show(Income $income)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Income retrieved successfully',
            'data' => $income
        ]);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date'
        ]);

        $income = Income::create([
            'name' => $validate['name'],
            'amount' => $validate['amount'],
            'user_id' => Auth::id(),
            'date' => $validate['date']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Income created successfully',
            'data' => $income
        ]);
    }

    public function update(Income $income, Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date'
        ]);

        $income->update([
            'name' => $validate['name'],
            'amount' => $validate['amount'],
            'date' => $validate['date']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Income updated successfully',
            'data' => $income
        ]);
    }

    public function delete(Income $income)
    {
        $income->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Income deleted successfully',
            'data' => ['incomeId' => $income->id]
        ]);
    }
}
