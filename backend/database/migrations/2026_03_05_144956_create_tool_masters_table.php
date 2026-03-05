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
        Schema::create('tool_masters', function (Blueprint $table) {
            $table->id();
            $table->string('tool_code')->unique();
            $table->string('tool_name');
            $table->string('category')->nullable(); // Cutting, Measuring, Jig/Fixture
            $table->string('location')->nullable();
            $table->date('purchase_date')->nullable();
            $table->date('next_calibration_date')->nullable();
            $table->enum('status', ['Active', 'Under Maintenance', 'Scrapped'])->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tool_masters');
    }
};
