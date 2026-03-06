<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('asset_depreciations');
        Schema::create('asset_depreciations', function (Blueprint $table) {
            $table->id();
            $table->string('depreciation_id')->unique();
            $table->integer('year');
            $table->string('asset_tag');
            $table->decimal('opening_balance', 15, 2);
            $table->decimal('depreciation_amount', 15, 2);
            $table->decimal('closing_balance', 15, 2);
            $table->timestamps();

            $table->foreign('asset_tag')->references('asset_tag')->on('asset_masters')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_depreciations');
    }
};
