<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ListedProduct;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function pendingProducts(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') abort(403);

        $products = ListedProduct::with(['user:id,name,email', 'design.product:id,category,image_url'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json(['products' => $products]);
    }

    public function updateProductStatus(Request $request, ListedProduct $listedProduct): JsonResponse
    {
        if ($request->user()->role !== 'admin') abort(403);

        $validated = $request->validate([
            'status' => ['required', 'in:approved,rejected'],
        ]);

        $listedProduct->update(['status' => $validated['status']]);

        // Trigger Seller Notification
        if ($validated['status'] === 'approved') {
            \App\Models\Notification::create([
                'user_id' => $listedProduct->user_id,
                'title' => 'Listing Confirmed',
                'content' => 'Your product listing "' . $listedProduct->title . '" has been successfully approved by the store admin and is now live in the storefront catalog!',
                'type' => 'approval',
            ]);
        } else {
            \App\Models\Notification::create([
                'user_id' => $listedProduct->user_id,
                'title' => 'Listing Rejected',
                'content' => 'Your product listing "' . $listedProduct->title . '" was reviewed and rejected by the admin. Please verify prompt guideline specifications.',
                'type' => 'approval',
            ]);
        }

        return response()->json(['message' => "Product status updated to {$validated['status']}"]);
    }

    public function sellers(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') abort(403);

        $sellers = User::where('role', 'seller')
            ->withCount(['products', 'designs'])
            ->get();

        return response()->json(['sellers' => $sellers]);
    }

    public function sellerDesigns(Request $request, User $seller): JsonResponse
    {
        if ($request->user()->role !== 'admin') abort(403);

        $designs = $seller->designs()->with('product:id,category,image_url')->latest()->get();

        return response()->json(['designs' => $designs]);
    }

    public function sales(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') abort(403);

        $sales = Sale::with(['seller:id,name,email', 'buyer:id,name,email', 'listedProduct.design'])
            ->latest()
            ->get();

        $totalAdminCommission = Sale::sum('admin_commission');

        return response()->json([
            'sales' => $sales,
            'total_admin_commission' => $totalAdminCommission,
        ]);
    }

    public function updateSaleStatus(Request $request, Sale $sale): JsonResponse
    {
        if ($request->user()->role !== 'admin') abort(403);

        $validated = $request->validate([
            'status' => ['required', 'in:confirmed,processing,shipped,delivered'],
        ]);

        $sale->update(['status' => $validated['status']]);

        // Load relations for listing title details
        $sale->load(['listedProduct']);

        $productTitle = $sale->listedProduct->title ?? 'Printed Leather Item';

        // 1. Notify the Buyer (Shopper)
        $buyerTitle = 'Order Update';
        $buyerContent = 'Your order #' . $sale->id . ' has been updated to "' . $validated['status'] . '".';

        if ($validated['status'] === 'confirmed') {
            $buyerTitle = 'Order Confirmed';
            $buyerContent = 'Your order #' . $sale->id . ' for "' . $productTitle . '" has been confirmed by the store admin!';
        } elseif ($validated['status'] === 'processing') {
            $buyerTitle = 'Order Processing';
            $buyerContent = 'Your order #' . $sale->id . ' is now being custom printed and processed.';
        } elseif ($validated['status'] === 'shipped') {
            $buyerTitle = 'Order Shipped';
            $buyerContent = 'Hurrah! Your custom printed leather item for order #' . $sale->id . ' has been shipped and is on the way!';
        } elseif ($validated['status'] === 'delivered') {
            $buyerTitle = 'Order Delivered';
            $buyerContent = 'Order Delivered: Enjoy your custom printed leather goods! Your order #' . $sale->id . ' is now complete.';
        }

        \App\Models\Notification::create([
            'user_id' => $sale->buyer_id,
            'title' => $buyerTitle,
            'content' => $buyerContent,
            'type' => 'shipping',
        ]);

        // 2. Notify the Seller
        \App\Models\Notification::create([
            'user_id' => $sale->seller_id,
            'title' => 'Fulfillment Update',
            'content' => 'Fulfillment progress: The order for your custom design "' . $productTitle . '" (Order #' . $sale->id . ') is now "' . $validated['status'] . '".',
            'type' => 'shipping',
        ]);

        return response()->json([
            'message' => "Order status updated to {$validated['status']}",
            'sale' => $sale->load(['seller:id,name,email', 'buyer:id,name,email', 'listedProduct.design'])
        ]);
    }
}
