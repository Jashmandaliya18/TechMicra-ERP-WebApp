<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$po = \App\Models\PurchaseOrder::first();
echo json_encode($po->toArray(), JSON_PRETTY_PRINT);
