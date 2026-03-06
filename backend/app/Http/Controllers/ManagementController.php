<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class ManagementController extends Controller
{
    public function getUsers()
    {
        return response()->json(User::with('roles')->get());
    }

    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|string'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        return response()->json($user->load('roles'));
    }

    public function deleteUser(User $user)
    {
        if ($user->hasRole('Super Admin')) {
            return response()->json(['message' => 'Cannot delete Super Admin'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function getRoles()
    {
        return response()->json(Role::with('permissions')->get());
    }

    public function updateRolePermissions(Request $request, Role $role)
    {
        if ($role->name === 'Super Admin') {
            return response()->json(['message' => 'Cannot modify Super Admin permissions'], 403);
        }

        $request->validate([
            'permissions' => 'required|array'
        ]);

        $role->syncPermissions($request->permissions);

        return response()->json(['message' => 'Role permissions updated successfully']);
    }
}
