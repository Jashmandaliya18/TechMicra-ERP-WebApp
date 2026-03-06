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
        Schema::create('quality_rejection_disposals', function (Blueprint $table) {
            $table->id();
            $table->string('qrd_no')->unique();
            $table->foreignId('product_id')->constrained('products');
            $table->integer('rejected_qty');
            $table->enum('source', ['IQC', 'PQC', 'PDI', 'Customer Return']);
            $table->enum('disposal_action', ['Scrap', 'Return', 'Rework', 'Downgrade'])->default('Scrap');
            $table->text('reason')->nullable();
            $table->foreignId('disposed_by')->constrained('users');
            $table->date('disposal_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quality_rejection_disposals');
    }
};
