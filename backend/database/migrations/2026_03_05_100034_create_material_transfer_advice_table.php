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
        Schema::create('material_transfer_advice', function (Blueprint $table) {
            $table->id();
            $table->string('mta_no')->unique();
            $table->date('mta_date');
            $table->string('from_department');
            $table->string('to_department');
            $table->foreignId('issued_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_transfer_advice');
    }
};
