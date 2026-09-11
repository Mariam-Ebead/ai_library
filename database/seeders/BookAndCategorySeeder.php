<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use App\Services\EmbeddingService;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class BookAndCategorySeeder extends Seeder
{
    public function run(): void
    {
        $userRole = Role::firstOrCreate(['name' => 'user']);
        $embeddingService = app(EmbeddingService::class);

        // 1. إضافة عدة مستخدمين باهتمامات مختلفة للاختبار
        $testUsers = [
            [
                'name' => 'Sara AI Researcher',
                'email' => 'sara@library.com',
                'password' => 'password123',
                'interests' => 'Artificial Intelligence, Machine Learning, Deep Learning, Python, Neural Networks',
                'skills' => 'Python, PyTorch, Math, Data Analysis',
                'learning_goals' => 'Build Large Language Models and Vision Systems',
            ],
            [
                'name' => 'Omar Cyber Security',
                'email' => 'omar@library.com',
                'password' => 'password123',
                'interests' => 'Cyber Security, Ethical Hacking, Network Defense, Penetration Testing, Cryptography',
                'skills' => 'Linux, Wireshark, Bash, Networking Protocols',
                'learning_goals' => 'Become a Certified Penetration Tester',
            ],
            [
                'name' => 'Karim Frontend Dev',
                'email' => 'karim@library.com',
                'password' => 'password123',
                'interests' => 'Web Development, UI/UX, React, JavaScript, CSS Architecture',
                'skills' => 'React, Next.js, Tailwind CSS, TypeScript',
                'learning_goals' => 'Master Design Systems and Modern Web Performance',
            ],
        ];

        foreach ($testUsers as $userData) {
            $user = User::firstOrCreate(['email' => $userData['email']], $userData);
            $user->assignRole($userRole);
        }

        // 2. التصنيفات
        $categoriesData = [
            'Programming' => 'Software engineering principles and programming languages',
            'Artificial Intelligence' => 'Machine learning, deep learning, NLP, and data science',
            'Cyber Security' => 'Ethical hacking, information security, and defense',
            'Networking' => 'Computer network infrastructure, protocols, and cloud routing',
            'Web Development' => 'Frontend, backend, and full-stack web architecture',
        ];

        $categories = [];
        foreach ($categoriesData as $name => $desc) {
            $categories[$name] = Category::firstOrCreate(['name' => $name], ['description' => $desc]);
        }

        // 3. مكتبة متنوعة من الكتب
        $booksData = [
            // كتب برمجة عامة
            [
                'title' => 'Clean Code: A Handbook of Agile Software Craftsmanship',
                'author' => 'Robert C. Martin',
                'category' => 'Programming',
                'isbn' => '978-0132350884',
                'copies' => 5,
                'cover' => '[https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80)',
                'desc' => 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. A guide on refactoring, design patterns, and writing professional clean code.',
            ],
            [
                'title' => 'The Pragmatic Programmer: Your Journey To Mastery',
                'author' => 'David Thomas & Andrew Hunt',
                'category' => 'Programming',
                'isbn' => '978-0201616224',
                'copies' => 3,
                'cover' => '[https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80)',
                'desc' => 'Covers topics ranging from career development and personal responsibility to architectural techniques for keeping your software adaptable and easy to maintain.',
            ],

            // كتب ذكاء اصطناعي
            [
                'title' => 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
                'author' => 'Aurélien Géron',
                'category' => 'Artificial Intelligence',
                'isbn' => '978-1492032649',
                'copies' => 4,
                'cover' => '[https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80)',
                'desc' => 'A comprehensive introduction to machine learning and deep learning using Python. Builds intuition using concrete examples, minimal theory, and production-ready Python frameworks.',
            ],
            [
                'title' => 'Deep Learning with Python',
                'author' => 'François Chollet',
                'category' => 'Artificial Intelligence',
                'isbn' => '978-1617294433',
                'copies' => 2,
                'cover' => '[https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80)',
                'desc' => 'Written by the creator of Keras, this book introduces the field of deep learning using Python and the Keras library for computer vision, NLP, and generative models.',
            ],

            // كتب أمن سيبراني
            [
                'title' => 'The Web Application Hacker\'s Handbook',
                'author' => 'Dafydd Stuttard & Marcus Pinto',
                'category' => 'Cyber Security',
                'isbn' => '978-1118026472',
                'copies' => 3,
                'cover' => '[https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80)',
                'desc' => 'Finding and exploiting security flaws in modern web applications. Covers SQL injection, cross-site scripting, authentication bypasses, and defensive countermeasures.',
            ],
            [
                'title' => 'Practical Malware Analysis',
                'author' => 'Michael Sikorski & Andrew Honig',
                'category' => 'Cyber Security',
                'isbn' => '978-1593272906',
                'copies' => 2,
                'cover' => '[https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80)',
                'desc' => 'The hands-on guide to dissecting malicious software. Teaches reverse engineering, disassembling binaries, and network signature extraction for malware defense.',
            ],

            // كتب شبكات
            [
                'title' => 'Computer Networking: A Top-Down Approach',
                'author' => 'James Kurose & Keith Ross',
                'category' => 'Networking',
                'isbn' => '978-0133594140',
                'copies' => 6,
                'cover' => '[https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80)',
                'desc' => 'Explains networking concepts from the application layer down to the physical layer. Focuses on Internet protocols, TCP/IP, routing algorithms, and network security.',
            ],

            // كتب تطوير الويب
            [
                'title' => 'Full-Stack React, TypeScript, and Node',
                'author' => 'David Choi',
                'category' => 'Web Development',
                'isbn' => '978-1839215414',
                'copies' => 4,
                'cover' => '[https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80)',
                'desc' => 'Build modern single-page applications with React and TypeScript, connect them to REST and GraphQL APIs using Node.js, and style them with responsive CSS.',
            ],
            [
                'title' => 'Laravel Up & Running: A Framework for Building Modern PHP Apps',
                'author' => 'Matt Stauffer',
                'category' => 'Web Development',
                'isbn' => '978-1492041214',
                'copies' => 3,
                'cover' => '[https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80](https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80)',
                'desc' => 'The definitive guide to the Laravel framework. Learn routing, Eloquent ORM, Blade, authentication, APIs, queues, and modern PHP best practices.',
            ],
        ];

        foreach ($booksData as $b) {
            $embedding = null;
            // محاولة توليد Vector للـ AI لو مفتاح OpenAI متاح، وإلا إضافته كـ null
            if (config('services.openai.key')) {
                try {
                    $text = "Title: {$b['title']}. Author: {$b['author']}. Category: {$b['category']}. Description: {$b['desc']}";
                    $embedding = $embeddingService->generateEmbedding($text);
                } catch (\Exception $e) {
                    $embedding = null;
                }
            }

            Book::updateOrCreate(
             ['isbn' => $b['isbn']],
                [
                    'title' => $b['title'],
                    'author' => $b['author'],
                    'category_id' => $categories[$b['category']]->id,
                    'available_copies' => $b['copies'],
                    'description' => $b['desc'],
                    'cover_image' => $b['cover'] ?? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
                    'publication_date' => now()->subYears(rand(1, 5))->format('Y-m-d'),
                    'embedding' => $embedding,
             ]
            );
        }
    }
}