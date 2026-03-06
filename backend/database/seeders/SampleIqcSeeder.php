<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PurchaseOrder;
use App\Models\GoodsReceiptNote;
use App\Models\IqcCheck;
use Carbon\Carbon;

class SampleIqcSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a Purchase Order
        $po = PurchaseOrder::create([
            'po_no' => 'PO-20260306-001',
            'vendor_name' => 'TechMicra Global Supplies',
            'po_date' => Carbon::now()->toDateString(),
            'valid_until' => Carbon::now()->addMonths(3)->toDateString(),
            'status' => 'Open',
            'total_amount' => 50000.00,
        ]);

        // 2. Create a Goods Receipt Note (GRN)
        $grn = GoodsReceiptNote::create([
            'grn_no' => 'GRN-20260306-001',
            'purchase_order_id' => $po->id,
            'vendor_challan_no' => 'VC-7890',
            'gate_entry_date' => Carbon::now()->toDateString(),
            'vehicle_no' => 'GJ-01-TM-1234',
        ]);

        // 3. Create sample IQC Checks
        IqcCheck::create([
            'goods_receipt_note_id' => $grn->id,
            'item_name' => 'Aluminum Extrusion 2020',
            'total_qty' => 100,
            'sample_size' => 10,
            'accepted_qty' => 95,
            'rejected_qty' => 5,
            'status' => 'Passed',
        ]);

        IqcCheck::create([
            'goods_receipt_note_id' => $grn->id,
            'item_name' => 'M3 T-Nuts (Steel)',
            'total_qty' => 500,
            'sample_size' => 50,
            'accepted_qty' => 480,
            'rejected_qty' => 20,
            'status' => 'Partial',
        ]);
        
        IqcCheck::create([
            'goods_receipt_note_id' => $grn->id,
            'item_name' => 'Nema 17 Stepper Motor',
            'total_qty' => 20,
            'sample_size' => 5,
            'accepted_qty' => 18,
            'rejected_qty' => 2,
            'status' => 'Failed',
        ]);
    }
}
