<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validate = $request->validate([
            'username' => 'required|string|max:255|min:3|unique:users,username',
            'password' => 'required|string|confirmed|min:8'
        ]);

        $user = User::create([
            'username' => $validate['username'],
            'password' => Hash::make($validate['password'])
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully',
            'data' => ['username' => $user['username']]
        ]);
    }

    public function login(Request $request)
    {
        $validate = $request->validate([
            'username' => 'required|string|max:255|min:3',
            'password' => 'required|string|min:8'
        ]);

        if (Auth::attempt($validate))
        {
            $user = Auth::user();
            $request->session()->regenerate();
            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => $user
            ]);
        }
        else
        {
            return response()->json([
                'status' => 'failed',
                'message' => 'Invalid login credentials',
                'data' => []
            ], 401);
        }
    }


    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json([
            'status' => 'success',
            'message' => 'Logout successful',
            'data' => []
        ]);
    }
}
