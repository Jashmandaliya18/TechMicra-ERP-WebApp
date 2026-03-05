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
        Schema::create('rectification_memos', function (Blueprint $table) {
            $table->id();
            $table->string('memo_no')->unique();
            $table->foreignId('tool_master_id')->constrained('tool_masters');
            $table->text('issue_description');
            $table->text('corrective_action')->nullable();
            $table->date('issue_date');
            $table->date('resolved_date')->nullable();
            $table->foreignId('raised_by')->constrained('users');
            $table->enum('status', ['Open', 'In-Progress', 'Closed'])->default('Open');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rectification_memos');
    }
};
