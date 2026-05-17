<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ListedProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Sale;

class ListedProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $listedProducts = ListedProduct::query()
            ->with(['design.product:id,category,image_url', 'sales'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(function ($product) {
                $product->units_sold = $product->sales->count();
                $product->net_earnings = (float) $product->sales->sum('seller_earnings');
                return $product;
            });

        return response()->json(['listed_products' => $listedProducts]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'design_id' => ['required', 'integer', 'exists:designs,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $design = $request->user()->designs()->findOrFail($validated['design_id']);

        $listedProduct = ListedProduct::create([
            'user_id' => $request->user()->id,
            'design_id' => $design->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
        ]);

        $listedProduct->units_sold = 0;
        $listedProduct->net_earnings = 0.0;

        // Notification to Admin (user_id is null)
        \App\Models\Notification::create([
            'user_id' => null,
            'title' => 'New Product Listed',
            'content' => 'Seller "' . $request->user()->name . '" listed a new custom print "' . $listedProduct->title . '" waiting for your review.',
            'type' => 'listing',
        ]);

        return response()->json([
            'message' => 'Product listed successfully. Waiting for admin approval.',
            'listed_product' => $listedProduct->load('design.product:id,category,image_url'),
        ], 201);
    }

    // Mock purchase endpoint for testing sales & commissions
    public function mockPurchase(Request $request, ListedProduct $listedProduct): JsonResponse
    {
        if ($listedProduct->status !== 'approved') {
            return response()->json(['message' => 'Cannot purchase an unapproved product.'], 400);
        }

        if ($listedProduct->quantity <= 0) {
            return response()->json(['message' => 'This product is out of stock.'], 400);
        }

        $amount = $listedProduct->price;
        $adminCommission = $amount * 0.10;
        $sellerEarnings = $amount * 0.90;

        $sale = Sale::create([
            'listed_product_id' => $listedProduct->id,
            'seller_id' => $listedProduct->user_id,
            'amount' => $amount,
            'admin_commission' => $adminCommission,
            'seller_earnings' => $sellerEarnings,
        ]);

        $listedProduct->decrement('quantity');

        return response()->json([
            'message' => 'Purchase successful.',
            'sale' => $sale,
        ]);
    }

    public function sales(Request $request): JsonResponse
    {
        $sales = Sale::with(['listedProduct.design.product:id,category,image_url'])
            ->where('seller_id', $request->user()->id)
            ->latest()
            ->get();

        $totalEarnings = $sales->sum('seller_earnings');

        return response()->json([
            'sales' => $sales,
            'total_earnings' => $totalEarnings,
        ]);
    }

    public function publicCatalog(Request $request): JsonResponse
    {
        $products = ListedProduct::query()
            ->with(['design.product:id,category,image_url', 'user:id,name'])
            ->where('status', 'approved')
            ->where('quantity', '>', 0)
            ->latest()
            ->get();

        return response()->json(['products' => $products]);
    }

    public function publicShow(ListedProduct $listedProduct): JsonResponse
    {
        if ($listedProduct->status !== 'approved') {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return response()->json([
            'product' => $listedProduct->load(['design.product:id,category,image_url', 'user:id,name'])
        ]);
    }

    public function update(Request $request, ListedProduct $listedProduct): JsonResponse
    {
        if ($listedProduct->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        $listedProduct->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? $listedProduct->description,
            'quantity' => $validated['quantity'],
        ]);

        return response()->json([
            'message' => 'Product inventory details updated successfully.',
            'listed_product' => $listedProduct->load('design.product:id,category,image_url'),
        ]);
    }
}
