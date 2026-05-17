<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = config('services.admin.email', 'admin@example.com');
        $password = config('services.admin.password', 'password');

        \App\Models\User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Admin',
                'password' => \Illuminate\Support\Facades\Hash::make($password),
                'role' => 'admin',
            ]
        );
    }
}
