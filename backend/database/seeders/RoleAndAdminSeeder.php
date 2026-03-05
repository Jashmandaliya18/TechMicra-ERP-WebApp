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
        $superAdminRole = Role::create(['name' => 'Super Admin']);
        $userRole = Role::create(['name' => 'User']);

        // Create Super Admin User
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@techmicra.com',
            'password' => Hash::make('password'),
        ]);

        // Assign Role
        $superAdmin->assignRole($superAdminRole);
    }
}
