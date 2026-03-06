<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

$email = 'admin@techmicra.com';
$password = 'admin123';

echo "Database: " . DB::connection()->getDatabaseName() . "\n";
$user = User::where('email', $email)->first();

if (!$user) {
    echo "FAILED: User not found in DB\n";
    exit;
}

echo "User found: " . $user->email . "\n";
echo "Stored Hash: " . $user->password . "\n";

$check = Hash::check($password, $user->password);
echo "Hash::check result: " . ($check ? "PASS" : "FAIL") . "\n";

if (!$check) {
    echo "Manual check with Hash::make simulation:\n";
    echo "Hash::make('admin123') would be: " . Hash::make('admin123') . "\n";
}
