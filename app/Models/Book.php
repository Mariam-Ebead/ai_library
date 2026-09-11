<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'description',
        'category_id',
        'isbn',
        'publication_date',
        'available_copies',
        'cover_image',
        'embedding',
    ];

    protected $casts = [
        'embedding' => 'array', 
    ];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}