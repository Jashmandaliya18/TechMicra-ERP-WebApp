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
        Schema::create('calibration_records', function (Blueprint $table) {
            $table->id();
            $table->string('calibration_no')->unique();
            $table->foreignId('tool_master_id')->constrained('tool_masters');
            $table->date('calibration_date');
            $table->date('next_due_date');
            $table->string('calibrated_by')->nullable(); // Internal or External lab
            $table->enum('result', ['Pass', 'Fail'])->default('Pass');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calibration_records');
    }
};
