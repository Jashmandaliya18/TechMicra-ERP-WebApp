<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $user = \App\Models\User::first();
    \Illuminate\Support\Facades\Auth::login($user);

    $request = Illuminate\Http\Request::create('/api/dashboard/stats', 'GET');
    $request->headers->set('Accept', 'application/json');

    $response = app()->handle($request);
    echo "STATUS: " . $response->getStatusCode() . "\n";
    echo $response->getContent() . "\n";
} catch (\Throwable $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
