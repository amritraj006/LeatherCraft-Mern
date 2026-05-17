<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListedProduct extends Model
{
    protected $fillable = [
        'user_id',
        'design_id',
        'title',
        'description',
        'price',
        'quantity',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function design()
    {
        return $this->belongsTo(Design::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
