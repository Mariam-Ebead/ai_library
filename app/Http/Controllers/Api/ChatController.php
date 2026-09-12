<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $userMessage = strtolower($request->input('message'));
        $isAdmin = $user->hasRole('admin');

        // الكلمات المفتاحية الإدارية الحساسة
        $adminKeywords = ['users', 'registered', 'how many users', 'total users', 'stock', 'inventory'];
        $asksForAdminStats = false;
        foreach ($adminKeywords as $keyword) {
            if (str_contains($userMessage, $keyword)) {
                $asksForAdminStats = true;
                break;
            }
        }

        // إذا كان السؤال إدارياً والسائل ليس أدمن -> رفض الطلب فوراً (Zero Leakage)
        if ($asksForAdminStats && !$isAdmin) {
            return response()->json([
                'message' => 'Access Denied: You do not have administrator permissions to view system statistics.'
            ], 403);
        }

        // تحضير سياق البيانات بناءً على الرتبة
        $systemContext = "You are a helpful and professional AI assistant for a digital library system. Answer questions concisely.\n";

        if ($isAdmin) {
            $totalUsers = User::count();
            $totalBooks = Book::count();
            $outOfStock = Book::where('available_copies', 0)->count();
            $systemContext .= "ADMIN CONTEXT: Total Registered Users = {$totalUsers}, Total Books = {$totalBooks}, Out of Stock Books = {$outOfStock}.\n";
        }

        // إضافة سياق عينة من الكتب المتاحة
        $booksSample = Book::with('category')->limit(10)->get()->map(function ($b) {
            return "Title: {$b->title}, Author: {$b->author}, Category: " . ($b->category->name ?? 'General') . ", Copies: {$b->available_copies}";
        })->implode("\n");

        $systemContext .= "AVAILABLE BOOKS IN CATALOG:\n" . $booksSample;

        // الاتصال بـ OpenAI
        $apiKey = config('services.openai.key') ?? env('OPENAI_API_KEY');
        if (!$apiKey) {
            return response()->json([
                'message' => 'OpenAI API key is missing in .env file.'
            ], 500);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => $systemContext],
                    ['role' => 'user', 'content' => $request->input('message')],
                ],
                'temperature' => 0.7,
                'max_tokens' => 300,
            ]);

            if ($response->failed()) {
                return response()->json([
                    'message' => 'OpenAI Error: ' . ($response->json()['error']['message'] ?? 'Service unavailable')
                ], 500);
            }

            $aiReply = $response->json()['choices'][0]['message']['content'];

            return response()->json([
                'reply' => $aiReply,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server Error: ' . $e->getMessage()
            ], 500);
        }
    }
}