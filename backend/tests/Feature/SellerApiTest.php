<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SellerApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_seller_can_create_product_generate_design_save_and_delete_it(): void
    {
        Storage::fake('public');

        $auth = $this->postJson('/api/register', [
            'name' => 'Maya Seller',
            'email' => 'maya@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertCreated();

        $token = $auth->json('token');

        $product = $this
            ->withToken($token)
            ->post('/api/product/upload', [
                'category' => 'bag',
                'image' => UploadedFile::fake()->image('bag.jpg', 900, 900),
            ])
            ->assertCreated()
            ->json('product');

        $generatedUrl = $this
            ->withToken($token)
            ->postJson('/api/ai/generate', [
                'image_url' => $product['image_url'],
                'prompt' => 'Add a teal stitched floral pattern and premium brass hardware.',
            ])
            ->assertOk()
            ->json('generated_image_url');

        $design = $this
            ->withToken($token)
            ->postJson('/api/design/save', [
                'product_id' => $product['id'],
                'original_image' => $product['image_url'],
                'ai_image' => $generatedUrl,
                'prompt' => 'Add a teal stitched floral pattern and premium brass hardware.',
            ])
            ->assertCreated()
            ->json('design');

        $this
            ->withToken($token)
            ->getJson('/api/designs')
            ->assertOk()
            ->assertJsonCount(1, 'designs');

        $this
            ->withToken($token)
            ->deleteJson('/api/design/'.$design['id'])
            ->assertOk();

        $this
            ->withToken($token)
            ->getJson('/api/designs')
            ->assertOk()
            ->assertJsonCount(0, 'designs');
    }
}
