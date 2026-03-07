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
        try {
            $customer->delete();
            return response()->json(['message' => 'Customer deleted successfully.']);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == 23000 || $e->getCode() == 1451) {
                return response()->json(['error' => 'Cannot delete customer as they have associated records (e.g., inquiries or orders).'], 400);
            }
            return response()->json(['error' => 'An error occurred while deleting the customer.'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
}
