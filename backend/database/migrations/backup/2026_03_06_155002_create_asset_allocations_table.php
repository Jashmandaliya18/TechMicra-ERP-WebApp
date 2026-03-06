<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('asset_allocations');
        Schema::create('asset_allocations', function (Blueprint $table) {
            $table->id();
            $table->string('allocation_id')->unique();
            $table->string('asset_tag');
            $table->string('employee_name');
            $table->string('department');
            $table->date('date_assigned');
            $table->date('date_returned')->nullable();
            $table->timestamps();

            $table->foreign('asset_tag')->references('asset_tag')->on('asset_masters')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_allocations');
    }
};
