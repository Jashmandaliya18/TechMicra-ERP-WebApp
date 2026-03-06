<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_sales', function (Blueprint $table) {
            $table->id();
            $table->string('sale_id')->unique();
            $table->string('asset_tag');
            $table->date('sale_date');
            $table->decimal('sale_value', 15, 2);
            $table->decimal('book_value', 15, 2);
            $table->timestamps();

            $table->foreign('asset_tag')->references('asset_tag')->on('asset_masters')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_sales');
    }
};
