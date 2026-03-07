<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    // Bypass auth
    $user = \App\Models\User::first();
    \Illuminate\Support\Facades\Auth::login($user);

    $request = Illuminate\Http\Request::create('/api/purchase-orders', 'POST', [
        'vendor_name' => 'Test Vendor',
        'po_date' => '2023-10-10',
        'items' => [
            ['item_name' => 'Widget', 'quantity' => 5, 'rate' => 100]
        ]
    ]);
    
    // Bypass Sanctum checks for this test
    $request->headers->set('Accept', 'application/json');

    $response = app()->handle($request);
    echo "STATUS: " . $response->getStatusCode() . "\n";
    echo $response->getContent() . "\n";
} catch (\Throwable $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
