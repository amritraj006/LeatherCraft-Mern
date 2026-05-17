<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['products' => $products]);
    }

    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:10240'],
            'category' => ['required', 'string', 'max:80'],
        ]);

        try {
            $path = $request->file('image')->store('leather/products', 'public');
            $url = asset('storage/' . $path);
        } catch (Throwable $e) {
            Log::error('Product image upload failed', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'message' => 'Image storage failed. Check local storage permissions.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 502);
        }

        $product = Product::create([
            'user_id' => $request->user()->id,
            'image_url' => $url,
            'category' => $validated['category'],
        ]);

        return response()->json([
            'product' => $product,
            'storage_provider' => 'local',
        ], 201);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        // Ensure the seller owns the product
        if ($product->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete designs file system images
        foreach ($product->designs as $design) {
            $designUrl = $design->ai_image;
            $designParts = explode('/storage/', $designUrl);
            if (count($designParts) > 1) {
                $designRelativePath = $designParts[1];
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($designRelativePath)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($designRelativePath);
                }
            }
        }

        // Delete the base product file system image
        $productUrl = $product->image_url;
        $productParts = explode('/storage/', $productUrl);
        if (count($productParts) > 1) {
            $productRelativePath = $productParts[1];
            if (\Illuminate\Support\Facades\Storage::disk('public')->exists($productRelativePath)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($productRelativePath);
            }
        }

        // Delete from database (cascades)
        $product->delete();

        return response()->json([
            'message' => 'Product and associated files deleted successfully.'
        ]);
    }
}
