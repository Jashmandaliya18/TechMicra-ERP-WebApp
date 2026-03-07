<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Inquiry;
use App\Models\Quotation;
use App\Models\SaleOrder;
use App\Models\Invoice;
use Carbon\Carbon;

class DummySalesSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Dummy Customers
        $customer1 = Customer::updateOrCreate(
            ['email' => 'contact@acme.com'],
            ['name' => 'Acme Corp', 'mobile' => '9876543210', 'credit_period_days' => 30]
        );

        $customer2 = Customer::updateOrCreate(
            ['email' => 'tony@stark.com'],
            ['name' => 'Stark Industries', 'mobile' => '9998887776', 'credit_period_days' => 15]
        );

        // 2. Create Dummy Products
        $product1 = Product::updateOrCreate(
            ['name' => 'Industrial Widget A'],
            ['unit_price' => 150.00, 'current_stock' => 500]
        );

        $product2 = Product::updateOrCreate(
            ['name' => 'Heavy Duty Gearbox'],
            ['unit_price' => 4500.00, 'current_stock' => 50]
        );

        $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();

        // 3. Create Dummy Inquiries
        $inq1 = Inquiry::updateOrCreate(
            ['inquiry_no' => 'INQ-001'],
            ['customer_id' => $customer1->id, 'sales_person_id' => $user->id, 'inquiry_date' => Carbon::now()->subDays(10), 'status' => 'Open']
        );

        $inq2 = Inquiry::updateOrCreate(
            ['inquiry_no' => 'INQ-002'],
            ['customer_id' => $customer2->id, 'sales_person_id' => $user->id, 'inquiry_date' => Carbon::now()->subDays(5), 'status' => 'Closed']
        );

        // 4. Create Dummy Quotations
        Quotation::updateOrCreate(
            ['quote_id' => 'QT-001'],
            ['inquiry_id' => $inq1->id, 'valid_until' => Carbon::now()->addDays(8)]
        );

        Quotation::updateOrCreate(
            ['quote_id' => 'QT-002'],
            ['inquiry_id' => $inq2->id, 'valid_until' => Carbon::now()->addDays(3)]
        );

        // 5. Create Dummy Sale Orders
        $so1 = SaleOrder::updateOrCreate(
            ['so_no' => 'SO-001'],
            ['customer_id' => $customer1->id, 'status' => 'Pending']
        );

        $so2 = SaleOrder::updateOrCreate(
            ['so_no' => 'SO-002'],
            ['customer_id' => $customer2->id, 'status' => 'Pending']
        );

        // 6. Create Dummy Invoice to show Total Sales
        Invoice::updateOrCreate(
            ['invoice_no' => 'INV-001'],
            ['sale_order_id' => $so1->id, 'invoice_date' => Carbon::now(), 'taxable_value' => 45000.00, 'gst_amount' => 8100.00, 'grand_total' => 53100.00]
        );
        
        Invoice::updateOrCreate(
            ['invoice_no' => 'INV-002'],
            ['sale_order_id' => $so1->id, 'invoice_date' => Carbon::now(), 'taxable_value' => 10000.00, 'gst_amount' => 1800.00, 'grand_total' => 11800.00]
        );
    }
}
