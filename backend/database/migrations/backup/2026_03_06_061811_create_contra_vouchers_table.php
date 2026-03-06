<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contra_vouchers', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('from_account')->nullable();
            $table->string('to_account')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contra_vouchers');
    }
};
