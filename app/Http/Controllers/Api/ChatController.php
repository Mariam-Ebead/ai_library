<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ChatContextService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    protected ChatContextService $contextService;

    public function __construct(ChatContextService $contextService)
    {
        $this->contextService = $contextService;
    }

    public function ask(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        $message = trim($request->message);

        if (! $user->hasRole('admin')) {
            if ($this->containsForbiddenAdminKeywords($message)) {
                return response()->json([
                    'reply' => 'Access Denied: You do not have permission to view library administrative statistics or user data.',
                ], 403);
            }
        }

        $contextData = $this->contextService->buildContext($user);

        $systemPrompt = $this->buildSystemPrompt($user->hasRole('admin'), $contextData);

        try {
            $response = Http::withToken(config('services.openai.key'))
                ->timeout(30)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o-mini',
                    'temperature' => 0.3, 
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $message],
                    ],
                ]);

            if ($response->failed()) {
                return response()->json([
                    'error' => 'AI Service error: ' . $response->body()
                ], 502);
            }

            $aiReply = $response->json('choices.0.message.content');

            return response()->json([
                'reply' => $aiReply,
                'role' => $user->getRoleNames()->first(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to connect to AI service: ' . $e->getMessage(),
            ], 500);
        }
    }

    protected function containsForbiddenAdminKeywords(string $text): bool
    {
        $keywords = [
            'total users', 'registered users', 'all users', 'list of users',
            'how many users', 'system statistics', 'admin statistics',
            'عدد المستخدمين', 'كل المستخدمين', 'إحصائيات النظام'
        ];

        foreach ($keywords as $kw) {
            if (stripos($text, $kw) !== false) {
                return true;
            }
        }

        return false;
    }


    protected function buildSystemPrompt(bool $isAdmin, array $context): string
    {
        $jsonContext = json_encode($context, JSON_UNESCAPED_UNICODE);

        if ($isAdmin) {
            return "You are an AI assistant for the Library Management System helping an ADMINISTRATOR.
            You have full authorization to answer queries about library statistics, book stock, registered user numbers, and categories.
            Answer based solely on this authorized context:
            {$jsonContext}
            Provide concise, accurate, and structured insights.";
        }

        return "You are a Library Assistant helping a regular LIBRARY USER.
        Your permissions:
        1. You can help the user discover books, get book recommendations, compare books, and explain topics based on their profile and available books.
        2. Strictly forbidden: Do NOT disclose system statistics, registered user counts, internal IDs, or admin operations.
        3. If the user asks for unauthorized data, politely refuse and state that this requires administrator privileges.
        Base your responses strictly on this catalog and user profile context:
        {$jsonContext}";
    }
}