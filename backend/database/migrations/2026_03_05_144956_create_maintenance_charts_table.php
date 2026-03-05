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
        Schema::create('maintenance_charts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tool_master_id')->constrained('tool_masters');
            $table->string('maintenance_type'); // Preventive, Corrective
            $table->date('scheduled_date');
            $table->date('completed_date')->nullable();
            $table->text('work_done')->nullable();
            $table->foreignId('performed_by')->nullable()->constrained('users');
            $table->enum('status', ['Scheduled', 'In-Progress', 'Completed'])->default('Scheduled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_charts');
    }
};
