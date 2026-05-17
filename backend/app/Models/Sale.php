<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    protected $fillable = [
        'listed_product_id',
        'seller_id',
        'buyer_id',
        'amount',
        'admin_commission',
        'seller_earnings',
        'status',
    ];

    public function listedProduct(): BelongsTo
    {
        return $this->belongsTo(ListedProduct::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
