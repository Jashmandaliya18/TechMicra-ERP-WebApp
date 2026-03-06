<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        return response()->json(Customer::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'contact_person'    => 'nullable|string|max:255',
            'email'             => 'nullable|email|unique:customers,email',
            'mobile'            => 'nullable|string|max:20',
            'billing_address'   => 'nullable|string',
            'shipping_address'  => 'nullable|string',
            'gst_no'            => 'nullable|string|max:20',
            'credit_period_days'=> 'nullable|integer|min:0',
        ]);

        $customer = Customer::create($data);
        return response()->json($customer, 201);
    }

    public function show(Customer $customer)
    {
        return response()->json($customer);
    }

    public function update(Request $request, Customer $customer)
    {
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'contact_person'    => 'nullable|string|max:255',
            'email'             => 'nullable|email|unique:customers,email,' . $customer->id,
            'mobile'            => 'nullable|string|max:20',
            'billing_address'   => 'nullable|string',
            'shipping_address'  => 'nullable|string',
            'gst_no'            => 'nullable|string|max:20',
            'credit_period_days'=> 'nullable|integer|min:0',
        ]);

        $customer->update($data);
        return response()->json($customer);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(['message' => 'Customer deleted successfully.']);
    }
}
