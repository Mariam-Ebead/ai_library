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
        Schema::table('books', function (Blueprint $table) {
           // حقل JSON لتخزين مصفوفة الأرقام (الـ Vector)
            $table->json('embedding')->nullable()->after('description');
        });
    }
    
    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn('embedding');
        });
    }
};
