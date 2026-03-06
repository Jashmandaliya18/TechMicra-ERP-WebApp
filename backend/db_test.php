<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

try {
    Schema::create('t_test', function (Blueprint $table) {
        $table->id();
        $table->timestamps();
    });
    echo "SUCCESS: Table created\n";
    Schema::dropIfExists('t_test');
} catch (\Exception $e) {
    echo "FAILURE: " . $e->getMessage() . "\n";
}
