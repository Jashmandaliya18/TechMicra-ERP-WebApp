<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tool_calibrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tool_id')->constrained('tools')->onDelete('cascade');
            $table->date('calibration_date');
            $table->string('standard_value')->nullable();
            $table->string('actual_value')->nullable();
            $table->string('result')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tool_calibrations');
    }
};
