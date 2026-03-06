<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RBACSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Define Modules and Actions
        $modules = [
            'Dashboard', 'Sales', 'Purchase', 'Production', 'Logistics', 
            'Quality', 'Maintenance', 'Finance', 'HR', 'Contractors', 
            'Stores', 'Assets', 'Reports', 'User Management', 'Roles'
        ];
        
        $actions = ['view', 'create', 'edit', 'delete'];

        // 2. Create Permissions
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "$module.$action", 'guard_name' => 'web']);
            }
        }

        // 3. Define Roles and their Module Access
        $roleMapping = [
            'Super Admin' => $modules, // All
            'Sales Manager' => ['Dashboard', 'Sales', 'Reports'],
            'Purchase Manager' => ['Dashboard', 'Purchase', 'Stores', 'Reports'],
            'Production Manager' => ['Dashboard', 'Production', 'Quality', 'Stores'],
            'Logistics Manager' => ['Dashboard', 'Logistics'],
            'Quality Manager' => ['Dashboard', 'Quality'],
            'Finance Manager' => ['Dashboard', 'Finance', 'Reports'],
            'HR Manager' => ['Dashboard', 'HR'],
            'Store Manager' => ['Dashboard', 'Stores'],
            'Maintenance Manager' => ['Dashboard', 'Maintenance'],
            'Contractor Manager' => ['Dashboard', 'Contractors'],
        ];

        foreach ($roleMapping as $roleName => $accessibleModules) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            
            $permissions = [];
            foreach ($accessibleModules as $module) {
                foreach ($actions as $action) {
                    $permissions[] = "$module.$action";
                }
            }
            
            $role->syncPermissions($permissions);
        }

        // Create test users for all roles
        $users = [
            'Super Admin' => 'admin@techmicra.com',
            'Sales Manager' => 'sales@techmicra.com',
            'Purchase Manager' => 'purchase@techmicra.com',
            'Production Manager' => 'production@techmicra.com',
            'Logistics Manager' => 'logistics@techmicra.com',
            'Quality Manager' => 'quality@techmicra.com',
            'Finance Manager' => 'finance@techmicra.com',
            'HR Manager' => 'hr@techmicra.com',
            'Store Manager' => 'store@techmicra.com',
            'Maintenance Manager' => 'maintenance@techmicra.com',
            'Contractor Manager' => 'contractor@techmicra.com',
        ];

        foreach ($users as $roleName => $email) {
            $password = str_replace(' ', '', strtolower(str_replace(' Manager', '', $roleName))) . '123';
            if ($roleName === 'Super Admin') $password = 'admin123';

            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $roleName,
                    'password' => Hash::make($password),
                ]
            );
            $user->assignRole($roleName);
        }
    }
}
