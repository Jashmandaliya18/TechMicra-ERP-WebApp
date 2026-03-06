<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create basic roles
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);
        $userRole = Role::firstOrCreate(['name' => 'User']);

        // Create Super Admin User
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@techmicra.com'],
            [
                'name' => 'Super Admin',
                'password' => 'admin123',
            ]
        );

        // Assign Role
        if (!$superAdmin->hasRole('Super Admin')) {
            $superAdmin->assignRole($superAdminRole);
        }
    }
}
