<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_additions', function (Blueprint $table) {
            $table->id();
            $table->string('addition_id')->unique();
            $table->string('asset_tag');
            $table->string('invoice_ref');
            $table->date('installation_date');
            $table->decimal('depreciation_rate_percent', 5, 2);
            $table->timestamps();

            $table->foreign('asset_tag')->references('asset_tag')->on('asset_masters')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_additions');
    }
};
