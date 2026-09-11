<?php

namespace App\Console\Commands;

use App\Models\Book;
use App\Services\EmbeddingService;
use Illuminate\Console\Command;

class GenerateBookEmbeddings extends Command
{
    protected $signature = 'books:generate-embeddings';
    protected $description = 'Generate embeddings for all books missing them';

    public function handle(EmbeddingService $service)
    {
        $books = Book::whereNull('embedding')->get();
        $this->info("Found {$books->count()} books needing embeddings.");

        foreach ($books as $book) {
            $this->line("Processing: {$book->title}");
            $text = "Title: {$book->title}. Author: {$book->author}. Description: {$book->description}";
            $book->embedding = $service->generateEmbedding($text);
            $book->save();
        }

        $this->info('All books updated successfully!');
    }
}