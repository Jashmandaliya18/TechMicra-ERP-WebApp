<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('dispatch_srvs', function (Blueprint $table) {
            $table->id();
            $table->string('srv_no')->unique();
            $table->date('date');
            $table->string('party_name');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('qty');
            $table->boolean('return_expected')->default(false);
            $table->date('return_expected_date')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('dispatch_srvs');
    }
};
