<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleAndUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. إنشاء الأدوار
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole  = Role::firstOrCreate(['name' => 'user']);

        // 2. إنشاء حساب Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@library.com'],
            [
                'name' => 'Admin User',
                'password' => 'password123',
            ]
        );
        $admin->assignRole($adminRole);

        // 3. إنشاء حساب User عادي مع اهتمامات
        $user = User::firstOrCreate(
            ['email' => 'user@library.com'],
            [
                'name' => 'John Doe',
                'password' => 'password123',
                'interests' => 'PHP, Laravel, Web Development',
                'skills' => 'JavaScript, HTML, CSS',
                'learning_goals' => 'Mastering Backend Architecture',
            ]
        );
        $user->assignRole($userRole);
    }
}