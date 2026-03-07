<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $user = \App\Models\User::first();
    \Illuminate\Support\Facades\Auth::login($user);
    $po = \App\Models\PurchaseOrder::first();

    $request = Illuminate\Http\Request::create('/api/purchase-orders/' . $po->id, 'PUT', [
        'vendor_name' => 'Updated Vendor Name Test',
        'po_date' => '2023-11-11',
        'valid_until' => '', // Testing empty string
        'items' => [
            ['item_name' => 'Updated Widget', 'quantity' => 10, 'rate' => 50]
        ]
    ]);
    $request->headers->set('Accept', 'application/json');

    $response = app()->handle($request);
    echo "STATUS: " . $response->getStatusCode() . "\n";
    echo $response->getContent() . "\n";
} catch (\Throwable $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
}
