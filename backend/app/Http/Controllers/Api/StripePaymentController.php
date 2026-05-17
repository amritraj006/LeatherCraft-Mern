<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ListedProduct;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class StripePaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createPaymentIntent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer', 'exists:listed_products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $totalAmount = 0.0;
        $itemsToPurchase = [];

        foreach ($validated['items'] as $item) {
            $product = ListedProduct::findOrFail($item['id']);

            if ($product->status !== 'approved') {
                return response()->json(['message' => "Product '{$product->title}' is not available."], 400);
            }

            if ($product->quantity < $item['quantity']) {
                return response()->json(['message' => "Insufficient stock for '{$product->title}'. Remaining: {$product->quantity} units."], 400);
            }

            $totalAmount += $product->price * $item['quantity'];
            $itemsToPurchase[] = [
                'product' => $product,
                'quantity' => $item['quantity']
            ];
        }

        try {
            $amountInCents = intval(round($totalAmount * 100));

            $paymentIntent = PaymentIntent::create([
                'amount' => $amountInCents,
                'currency' => 'inr',
                'payment_method_types' => ['card'],
                'metadata' => [
                    'items' => json_encode(array_map(function ($item) {
                        return [
                            'id' => $item['product']->id,
                            'quantity' => $item['quantity']
                        ];
                    }, $itemsToPurchase))
                ]
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'paymentIntentId' => $paymentIntent->id,
                'amount' => $totalAmount
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Stripe Error: ' . $e->getMessage()], 500);
        }
    }

    public function confirmPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_intent_id' => ['required', 'string'],
        ]);

        try {
            $paymentIntent = PaymentIntent::retrieve($validated['payment_intent_id']);

            if ($paymentIntent->status !== 'succeeded') {
                return response()->json(['message' => 'Payment has not succeeded yet.'], 400);
            }

            $items = json_decode($paymentIntent->metadata->items, true);
            $salesCreated = [];

            DB::transaction(function () use ($items, $request, &$salesCreated) {
                foreach ($items as $itemData) {
                    $product = ListedProduct::lockForUpdate()->findOrFail($itemData['id']);

                    $amount = $product->price * $itemData['quantity'];
                    $adminCommission = $amount * 0.10;
                    $sellerEarnings = $amount * 0.90;

                    $sale = Sale::create([
                        'listed_product_id' => $product->id,
                        'seller_id' => $product->user_id,
                        'buyer_id' => $request->user()?->id,
                        'amount' => $amount,
                        'admin_commission' => $adminCommission,
                        'seller_earnings' => $sellerEarnings,
                        'status' => 'processing',
                    ]);

                    $product->decrement('quantity', $itemData['quantity']);
                    $salesCreated[] = $sale;

                    // 1. Notification to the Buyer (Shopper)
                    \App\Models\Notification::create([
                        'user_id' => $request->user()?->id,
                        'title' => 'Order Confirmed',
                        'content' => 'Thank you! Your purchase of "' . $product->title . '" (x' . $itemData['quantity'] . ') has been successfully processed.',
                        'type' => 'purchase',
                    ]);

                    // 2. Notification to the Seller
                    \App\Models\Notification::create([
                        'user_id' => $product->user_id,
                        'title' => 'Product Purchased',
                        'content' => 'Great news! Customer "' . ($request->user()?->name ?: 'A buyer') . '" purchased your product "' . $product->title . '" (x' . $itemData['quantity'] . '). Net Earnings: ₹' . number_format($sellerEarnings, 2) . '.',
                        'type' => 'purchase',
                    ]);

                    // 3. Notification to the Admin (user_id is null)
                    \App\Models\Notification::create([
                        'user_id' => null,
                        'title' => 'New Order Placed',
                        'content' => 'Customer "' . ($request->user()?->name ?: 'A buyer') . '" purchased "' . $product->title . '" from Seller ID ' . $product->user_id . '. Amount: ₹' . number_format($amount, 2) . ', Admin Commission: ₹' . number_format($adminCommission, 2) . '.',
                        'type' => 'purchase',
                    ]);
                }
            });

            return response()->json([
                'message' => 'Order completed and payment verified successfully.',
                'sales' => $salesCreated
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Order confirmation failed: ' . $e->getMessage()], 500);
        }
    }

    public function customerOrders(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $orders = Sale::with(['listedProduct.design', 'seller'])
            ->where('buyer_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'amount' => $sale->amount,
                    'status' => $sale->status,
                    'created_at' => $sale->created_at->toIso8601String(),
                    'product' => [
                        'id' => $sale->listedProduct?->id,
                        'title' => $sale->listedProduct?->title,
                        'price' => $sale->listedProduct?->price,
                        'description' => $sale->listedProduct?->description,
                        'image' => $sale->listedProduct?->design?->ai_image,
                    ],
                    'seller' => [
                        'name' => $sale->seller?->name,
                    ]
                ];
            })
        ]);
    }
}
