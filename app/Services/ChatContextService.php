<?php

namespace App\Services;

use App\Models\Book;
use App\Models\Category;
use App\Models\User;

class ChatContextService
{

    public function buildContext(User $user): array
    {
        if ($user->hasRole('admin')) {
            return $this->getAdminContext();
        }

        return $this->getUserContext($user);
    }

    protected function getAdminContext(): array
    {
        return [
            'role' => 'admin',
            'permissions' => 'Full administrative access',
            'stats' => [
                'total_users' => User::count(),
                'total_books' => Book::count(),
                'categories_count' => Category::count(),
                'low_stock_books' => Book::where('available_copies', '<=', 2)
                    ->select('id', 'title', 'available_copies')
                    ->get(),
                'category_distribution' => Category::withCount('books')
                    ->get()
                    ->map(fn($c) => ['category' => $c->name, 'books_count' => $c->books_count]),
            ],
            'available_books' => Book::with('category')->get(['id', 'title', 'author', 'isbn', 'available_copies']),
        ];
    }

    protected function getUserContext(User $user): array
    {
        return [
            'role' => 'user',
            'permissions' => 'Standard user browsing only',
            'user_profile' => [
                'name' => $user->name,
                'interests' => $user->interests,
                'skills' => $user->skills,
                'learning_goals' => $user->learning_goals,
            ],
            'catalog' => Book::with('category:id,name')
                ->where('available_copies', '>', 0)
                ->get(['id', 'title', 'author', 'description', 'category_id', 'available_copies']),
        ];
    }
}