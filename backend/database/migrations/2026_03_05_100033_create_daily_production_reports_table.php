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
        Schema::create('daily_production_reports', function (Blueprint $table) {
            $table->id();
            $table->date('report_date');
            $table->string('work_center');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('routecard_id')->nullable()->constrained('routecards');
            $table->integer('qty_produced')->default(0);
            $table->integer('scrap_qty')->default(0);
            $table->foreignId('reported_by')->constrained('users');
            $table->string('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_production_reports');
    }
};
