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
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('inquiry_no')->unique();
            $table->foreignId('customer_id')->constrained('customers');
            $table->foreignId('sales_person_id')->constrained('users');
            $table->date('inquiry_date');
            $table->enum('status', ['New', 'Processing', 'Quoted', 'Lost'])->default('New');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
