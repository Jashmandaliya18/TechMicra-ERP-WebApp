<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'unit_price'    => 'nullable|numeric|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'blocked_stock' => 'nullable|integer|min:0',
        ]);

        $product = Product::create($data);
        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'unit_price'    => 'nullable|numeric|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'blocked_stock' => 'nullable|integer|min:0',
        ]);

        $product->update($data);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();
            return response()->json(['message' => 'Product deleted successfully.']);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == 23000 || $e->getCode() == 1451) {
                return response()->json(['error' => 'Cannot delete product because it is used in associated records (e.g., invoices, orders, or inquiries).'], 400);
            }
            return response()->json(['error' => 'An error occurred while deleting the product.'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }
}
