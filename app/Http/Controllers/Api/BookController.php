<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use App\Services\EmbeddingService;
use Illuminate\Support\Facades\Storage;


class BookController extends Controller
{
    protected EmbeddingService $embeddingService;
    public function __construct(EmbeddingService $embeddingService)
    {
        $this->embeddingService = $embeddingService;
    }
    public function index(Request $request)
    {
        $query = Book::with('category');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $books = $query->latest()->paginate(10);

        return response()->json($books);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'isbn' => 'required|string|unique:books,isbn|max:100',
            'publication_date' => 'nullable|date',
            'available_copies' => 'required|integer|min:0',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // يقبل صورة بحد أقصى 2MB
        ]);
    
        // رفع وتخزين الصورة إن وجدت
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
            // حفظ الرابط الكامل المتاح للوصول عبر الويب
            $validated['cover_image'] = asset('storage/' . $path);
        }
    
        // توليد الـ Vector للذكاء الاصطناعي
        $textToEmbed = "Title: {$validated['title']}. Author: {$validated['author']}. Description: {$validated['description']}";
        try {
            $validated['embedding'] = $this->embeddingService->generateEmbedding($textToEmbed);
        } catch (\Exception $e) {
            $validated['embedding'] = null;
        }
    
        $book = Book::create($validated);
    
        return response()->json([
            'message' => 'Book created successfully',
            'book' => $book->load('category'),
        ], 201);
    }

    public function show($id)
    {
        $book = Book::with('category')->findOrFail($id);
        return response()->json($book);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'isbn' => 'sometimes|required|string|max:100|unique:books,isbn,' . $book->id,
            'publication_date' => 'nullable|date',
            'available_copies' => 'sometimes|required|integer|min:0',
            'cover_image' => 'nullable|string',
        ]);

        if (isset($validated['title']) || isset($validated['description'])) {
            $title = $validated['title'] ?? $book->title;
            $author = $validated['author'] ?? $book->author;
            $desc = $validated['description'] ?? $book->description;
            
            try {
                $validated['embedding'] = $this->embeddingService->generateEmbedding("Title: {$title}. Author: {$author}. Description: {$desc}");
            } catch (\Exception $e) {
                // تجاهل إذا لم يتوفر اتصال
            }
        }

        $book->update($validated);

        return response()->json([
            'message' => 'Book updated successfully',
            'book' => $book->load('category'),
        ]);
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $book->delete();

        return response()->json(['message' => 'Book deleted successfully']);
    }
}