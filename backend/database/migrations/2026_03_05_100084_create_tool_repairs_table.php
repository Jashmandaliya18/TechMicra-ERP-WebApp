<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tool_repairs', function (Blueprint $table) {
            $table->id();
            $table->string('job_id')->nullable();
            $table->foreignId('tool_id')->constrained('tools')->onDelete('cascade');
            $table->text('issue')->nullable();
            $table->text('spares_used')->nullable();
            $table->decimal('cost', 10, 2)->default(0);
            $table->string('technician')->nullable();
            $table->date('repair_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tool_repairs');
    }
};
