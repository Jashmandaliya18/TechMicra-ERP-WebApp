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
        Schema::create('store_masters', function (Blueprint $table) {
            $table->id();
            $table->string('store_code')->unique();
            $table->string('store_name');
            $table->string('location')->nullable();
            $table->string('store_type')->nullable(); // Raw Material, Finished Goods, WIP
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_masters');
    }
};
