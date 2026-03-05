<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('routecards', function (Blueprint $table) {
            $table->id();
            $table->string('routecard_no')->unique();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('bom_id')->constrained('boms');
            $table->integer('batch_size');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routecards');
    }
};
