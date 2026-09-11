<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Services\EmbeddingService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    protected EmbeddingService $embeddingService;

    public function __construct(EmbeddingService $embeddingService)
    {
        $this->embeddingService = $embeddingService;
    }

    public function getRecommendations(Request $request)
    {
        $user = $request->user();

        $userProfileText = trim("{$user->interests} {$user->skills} {$user->learning_goals}");

        if (empty($userProfileText)) {
            return response()->json([
                'message' => 'Please update your profile interests to get personalized recommendations.',
                'books' => [],
            ]);
        }

        try {
            $userVector = $this->embeddingService->generateEmbedding($userProfileText);
        } catch (\Exception $e) {
            return response()->json(['error' => 'AI Service error: ' . $e->getMessage()], 502);
        }

        $books = Book::with('category')->whereNotNull('embedding')->get();

        $recommendedBooks = $books->map(function ($book) use ($userVector) {
            $similarity = $this->embeddingService->cosineSimilarity($userVector, $book->embedding);

            $percentage = max(0, min(100, (int) round($similarity * 100)));

            unset($book->embedding);

            $book->match_percentage = $percentage;
            return $book;
        });

        $sorted = $recommendedBooks->sortByDesc('match_percentage')->values();

        return response()->json([
            'user_interests' => $userProfileText,
            'total_recommended' => $sorted->count(),
            'books' => $sorted,
        ]);
    }
}