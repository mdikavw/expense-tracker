<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $expenses = $user->expenses()->with('category:id,name')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Expenses retrieved successfully',
            'data' => $expenses
        ]);
    }

    public function expenseByCategory()
    {
        $user = Auth::user();
        $categories = $user->categories()
            ->withSum('expenses', 'amount')
            ->get()
            ->map(function ($category)
            {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'total_expense' => $category->expenses_sum_amount,
                ];
            });

        $otherTotalExpense = $user->expenses()
            ->whereNull('category_id')
            ->sum('amount');

        if ($otherTotalExpense > 0)
        {
            $categories->push([
                'id' => null,
                'name' => 'Other',
                'total_expense' => $otherTotalExpense,
            ]);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Expense by category retrieved successfully',
            'data' => $categories
        ]);
    }

    public function monthlyComparison()
    {
        $user = Auth::user();
        $currentMonth = now()->month;
        $previousMonth = now()->subMonth()->month;

        $currentExpenses = $user->expenses()
            ->whereMonth('date', $currentMonth)
            ->sum('amount');

        $currentIncome = $user->incomes()
            ->whereMonth('date', $currentMonth)
            ->sum('amount');

        $previousExpenses = $user->expenses()
            ->whereMonth('date', $previousMonth)
            ->sum('amount');

        $previousIncome = $user->incomes()
            ->whereMonth('date', $previousMonth)
            ->sum('amount');

        return response()->json([
            'status' => 'success',
            'message' => 'Monthly comparison data retrieved successfully',
            'data' => [
                'current' => [
                    'expenses' => $currentExpenses,
                    'income' => $currentIncome,
                    'revenue' => $currentIncome - $currentExpenses,
                ],
                'previous' => [
                    'expenses' => $previousExpenses,
                    'income' => $previousIncome,
                    'revenue' => $previousIncome - $previousExpenses,
                ],
                'changes' => [
                    'expenses' => $this->calculatePercentageChange($previousExpenses, $currentExpenses),
                    'income' => $this->calculatePercentageChange($previousIncome, $currentIncome),
                    'revenue' => $this->calculatePercentageChange(
                        $previousIncome - $previousExpenses,
                        $currentIncome - $currentExpenses
                    ),
                ]
            ]
        ]);
    }

    private function calculatePercentageChange($previous, $current)
    {
        if ($previous == 0)
        {
            return $current > 0 ? 100 : 0; // Avoid division by zero
        }
        return round((($current - $previous) / $previous) * 100, 2);
    }

    public function show(Expense $expense)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Expense retrieved successfully',
            'data' => $expense->load('category:id,name')
        ]);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'date' => 'required|date'
        ]);

        $expense = Expense::create([
            'user_id' => Auth::id(),
            'name' => $validate['name'],
            'amount' => $validate['amount'],
            'category_id' => $validate['category_id'],
            'date' => $validate['date']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Expense created successfully',
            'data' => $expense
        ]);
    }

    public function update(Expense $expense, Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'date' => 'required|date'
        ]);

        $expense->update([
            'name' => $validate['name'],
            'amount' => $validate['amount'],
            'category_id' => $validate['category_id'],
            'date' => $validate['date']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Expense updated successfully',
            'data' => $expense
        ]);
    }

    public function delete(Expense $expense)
    {
        $expense->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Expense deleted successfully',
            'data' => ['expenseId' => $expense->id]
        ]);
    }
}
