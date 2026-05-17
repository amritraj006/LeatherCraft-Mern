<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->foreignId('buyer_id')->nullable()->after('seller_id')->constrained('users')->onDelete('cascade');
            $table->string('status')->default('confirmed')->after('seller_earnings'); // confirmed, shipped, delivered
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropForeign(['buyer_id']);
            $table->dropColumn(['buyer_id', 'status']);
        });
    }
};
