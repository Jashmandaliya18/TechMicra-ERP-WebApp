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
        Schema::create('routecard_operations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routecard_id')->constrained('routecards')->cascadeOnDelete();
            $table->integer('sequence_no'); // e.g., 10, 20, 30
            $table->string('operation_name'); // e.g., Cutting, Welding, Assembly
            $table->string('work_center')->nullable();
            $table->integer('processing_time_mins')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routecard_operations');
    }
};
