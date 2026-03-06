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
        Schema::create('material_indents', function (Blueprint $table) {
            $table->id();
            $table->string('indent_no')->unique();
            $table->date('request_date');
            $table->string('department');
            $table->string('priority')->default('Medium');
            $table->string('status')->default('Pending');
            $table->foreignId('requested_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_indents');
    }
};
