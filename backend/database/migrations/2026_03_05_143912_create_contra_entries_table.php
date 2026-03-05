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
        Schema::create('contra_entries', function (Blueprint $table) {
            $table->id();
            $table->string('contra_no')->unique();
            $table->date('entry_date');
            $table->foreignId('from_ledger_id')->constrained('ledger_accounts'); // Bank/Cash
            $table->foreignId('to_ledger_id')->constrained('ledger_accounts'); // Bank/Cash
            $table->decimal('amount', 15, 2);
            $table->string('reference_no')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contra_entries');
    }
};
