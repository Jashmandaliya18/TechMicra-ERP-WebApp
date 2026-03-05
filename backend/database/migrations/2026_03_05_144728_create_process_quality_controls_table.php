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
        Schema::create('process_quality_controls', function (Blueprint $table) {
            $table->id();
            $table->string('pqc_no')->unique();
            $table->foreignId('routecard_id')->constrained('routecards');
            $table->string('operation_stage'); // e.g., After Welding, After Painting
            $table->integer('sample_size')->default(1);
            $table->integer('accepted_qty')->default(0);
            $table->integer('rejected_qty')->default(0);
            $table->enum('result', ['Pass', 'Fail', 'Conditional'])->default('Pass');
            $table->foreignId('inspected_by')->constrained('users');
            $table->date('inspection_date');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('process_quality_controls');
    }
};
