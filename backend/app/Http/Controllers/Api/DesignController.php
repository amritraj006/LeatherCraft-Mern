<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Design;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DesignController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $designs = Design::query()
            ->with(['product:id,category,image_url', 'listedProduct:id,design_id,status,price'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json(['designs' => $designs]);
    }
    
    public function save(Request $request): JsonResponse
    {
        if ($request->hasFile('design_image')) {
            $file = $request->file('design_image');
            \Illuminate\Support\Facades\Log::info('Design image file details', [
                'isValid' => $file->isValid(),
                'error' => $file->getError(),
                'errorMessage' => $file->getErrorMessage(),
                'size' => $file->getSize(),
            ]);
        } else {
             \Illuminate\Support\Facades\Log::info('No design_image file found in request');
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'original_image' => ['nullable', 'string'],
            'design_image' => ['required', 'file', 'max:10240'],
        ]);

        if ($validator->fails()) {
            \Illuminate\Support\Facades\Log::error('Design save validation failed', [
                'errors' => $validator->errors()->toArray(),
                'input' => $request->all()
            ]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $product = Product::query()
            ->where('user_id', $request->user()->id)
            ->findOrFail($validated['product_id']);

        $path = $request->file('design_image')->store('leather/designs', 'public');
        $url = asset('storage/' . $path);

        $design = Design::create([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
            'original_image' => $validated['original_image'] ?? $product->image_url,
            'ai_image' => $url, // Repurposing ai_image column to store the manual design
            'prompt' => 'Manual Design Upload', // Default value
        ]);

        return response()->json([
            'design' => $design->load('product:id,category,image_url'),
        ], 201);
    }

    public function destroy(Request $request, Design $design): JsonResponse
    {
        if ($design->user_id !== $request->user()->id) {
            abort(404);
        }

        $design->delete();

        return response()->json(['message' => 'Design deleted.']);
    }
}
