<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BorrowController extends Controller
{
    // استعارة كتاب
    public function borrow(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return DB::transaction(function () use ($user, $id) {
            // قفل السجل لحظياً للحماية من التعارض
            $book = Book::lockForUpdate()->find($id);

            if (!$book) {
                return response()->json(['message' => 'Book not found.'], 404);
            }

            // فحص هل استعار هذا الكتاب مسبقاً ولم يرجعه بعد؟
            $alreadyBorrowed = Borrowing::where('user_id', $user->id)
                ->where('book_id', $book->id)
                ->where('status', 'borrowed')
                ->exists();

            if ($alreadyBorrowed) {
                return response()->json([
                    'message' => 'You already have an active borrowing for this book.'
                ], 400);
            }

            // فحص توافر نسخ
            if ($book->available_copies <= 0) {
                return response()->json([
                    'message' => 'Sorry, this book is currently out of stock.'
                ], 400);
            }

            // تسجيل عملية الاستعارة (مدة الاستعارة 14 يوم مثلاً)
            $borrowing = Borrowing::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'borrowed_at' => now(),
                'due_at' => now()->addDays(14),
                'status' => 'borrowed',
            ]);

            // تقليل عدد النسخ المتاحة بمقدار 1
            $book->decrement('available_copies');

            return response()->json([
                'message' => 'Book borrowed successfully!',
                'available_copies' => $book->available_copies,
                'due_at' => $borrowing->due_at->toDateString(),
            ]);
        });
    }

    // فحص حالة استعارة المستخدم للكتاب الحالي (عشان الزرار في الفرونت يعرف هل هو مستعيره ولا لأ)
    public function checkStatus(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['is_borrowed' => false]);
        }

        $isBorrowed = Borrowing::where('user_id', $user->id)
            ->where('book_id', $id)
            ->where('status', 'borrowed')
            ->exists();

        return response()->json(['is_borrowed' => $isBorrowed]);
    }
}