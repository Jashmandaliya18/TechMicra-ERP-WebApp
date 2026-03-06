<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Debug logging (Remove before production)
        \Log::info('Login attempt', [
            'email' => $request->email,
            'user_found' => (bool)$user,
            'email_match' => $user ? ($user->email === $request->email) : false,
            'password_len' => strlen($request->password),
            'password_sha1' => sha1($request->password),
            'expected_sha1' => sha1('admin123'),
        ]);

        if (! $user || ! Hash::check($request->password, $user->password)) {
            \Log::warning('Login failed for: ' . $request->email);
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user->load('roles')
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user()->load('roles'));
    }
}
