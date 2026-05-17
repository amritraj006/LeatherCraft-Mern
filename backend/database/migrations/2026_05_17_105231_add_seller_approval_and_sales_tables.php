<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('listed_products', 'status')) {
            Schema::table('listed_products', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }

        Schema::table('listed_products', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->after('price');
        });

        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listed_product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->decimal('admin_commission', 10, 2);
            $table->decimal('seller_earnings', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
        Schema::table('listed_products', function (Blueprint $table) {
            if (Schema::hasColumn('listed_products', 'status')) {
                $table->dropColumn('status');
            }
            $table->string('status')->default('active');
        });
    }
};
