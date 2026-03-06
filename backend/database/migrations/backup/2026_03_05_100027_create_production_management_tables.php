<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. BOM
        Schema::dropIfExists('boms');
        Schema::create('boms', function (Blueprint $table) {
            $table->id();
            $table->string('finished_good');
            $table->string('process_name');
            $table->string('machine');
            $table->text('raw_material_input');
            $table->integer('output_qty');
            $table->timestamps();
        });

        // 2. Route Card
        Schema::dropIfExists('route_cards');
        Schema::create('route_cards', function (Blueprint $table) {
            $table->id();
            $table->string('route_card_no');
            $table->string('batch_no');
            $table->string('product');
            $table->integer('plan_qty');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->enum('status', ['planned', 'in_progress', 'completed'])->default('planned');
            $table->timestamps();
        });

        // 3. Material Issue
        Schema::dropIfExists('material_issues');
        Schema::create('material_issues', function (Blueprint $table) {
            $table->id();
            $table->string('issue_id');
            $table->string('route_card_ref');
            $table->string('item');
            $table->integer('qty_requested');
            $table->integer('qty_issued');
            $table->date('issued_date');
            $table->timestamps();
        });

        // 4. MTA
        Schema::dropIfExists('mtas');
        Schema::create('mtas', function (Blueprint $table) {
            $table->id();
            $table->string('mta_no');
            $table->string('from_department');
            $table->string('to_department');
            $table->string('item');
            $table->integer('qty');
            $table->string('received_by');
            $table->date('transfer_date');
            $table->timestamps();
        });

        // 5. Production Report
        Schema::dropIfExists('production_reports');
        Schema::create('production_reports', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('shift');
            $table->string('machine_no');
            $table->string('operator');
            $table->integer('production_qty');
            $table->integer('rejection_qty');
            $table->timestamps();
        });

        // 6. Job Order
        Schema::dropIfExists('job_orders');
        Schema::create('job_orders', function (Blueprint $table) {
            $table->id();
            $table->string('job_order_no');
            $table->string('contractor');
            $table->string('item_sent');
            $table->string('process_required');
            $table->decimal('rate', 8, 2);
            $table->timestamps();
        });

        // 7. Challan Out
        Schema::dropIfExists('challans');
        Schema::create('challans', function (Blueprint $table) {
            $table->id();
            $table->string('challan_no');
            $table->string('job_order_ref');
            $table->string('item');
            $table->integer('qty');
            $table->string('vehicle_no');
            $table->timestamps();
        });

        // 8. External GRN & IQC
        Schema::dropIfExists('external_grns');
        Schema::create('external_grns', function (Blueprint $table) {
            $table->id();
            $table->string('grn_no');
            $table->string('challan_ref');
            $table->integer('received_qty');
            $table->integer('passed_qty');
            $table->integer('rejected_qty');
            $table->timestamps();
        });

        // 9. Job Work Billbook
        Schema::dropIfExists('job_bills');
        Schema::create('job_bills', function (Blueprint $table) {
            $table->id();
            $table->string('bill_no');
            $table->string('job_order_ref');
            $table->decimal('labor_charges', 10, 2);
            $table->decimal('gst', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->timestamps();
        });

        // 10. Route Card Closure
        Schema::dropIfExists('route_card_closures');
        Schema::create('route_card_closures', function (Blueprint $table) {
            $table->id();
            $table->string('route_card_ref');
            $table->integer('final_fg_qty');
            $table->integer('scrap_generated');
            $table->date('closure_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('route_card_closures');
        Schema::dropIfExists('job_bills');
        Schema::dropIfExists('external_grns');
        Schema::dropIfExists('challans');
        Schema::dropIfExists('job_orders');
        Schema::dropIfExists('production_reports');
        Schema::dropIfExists('mtas');
        Schema::dropIfExists('material_issues');
        Schema::dropIfExists('route_cards');
        Schema::dropIfExists('boms');
    }
};
