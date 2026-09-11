# 📚 AI-Powered Library Management System

An intelligent, full-stack digital library management system combining traditional enterprise CRUD operations with **Generative AI** and **Semantic Vector Search**. Built with a **Laravel (PHP)** REST API backend and a modern **React (Vite + Tailwind CSS)** frontend.

---

## 🌟 Key Features

### 1. Robust Role-Based Access Control (RBAC)

- **Admin Role:** Full management of books, categories, user profiles, and system-wide statistical analytics.
- **User Role:** Personalized catalog browsing, dynamic search/filter, profile interest management, and AI book matching.
- **Security Guardrails:** Powered by Laravel Sanctum (Token Auth) and Spatie Laravel-Permission.

### 2. Semantic AI Recommendations (Cosine Similarity)

- Matches a user's skills, interests, and learning goals against library book descriptions.
- Computes mathematical **Cosine Similarity** from high-dimensional vector embeddings (`text-embedding-3-small`).
- Dynamically calculates a **Match Percentage (%)** for each book and sorts recommendations by highest relevance.

### 3. Role-Aware Generative AI Chatbot

- Context-aware chatbot powered by OpenAI LLM completions.
- **Strict Data Segregation:** The AI never accesses the database directly. Laravel pre-filters the context based on authenticated privileges:
    - **Admins:** Can query system stats (total users, low-stock books, category distribution).
    - **Users:** Can query catalog descriptions, comparisons, and personalized recommendations.
    - **Zero Leakage:** Requests from standard users attempting to access administrative stats are rejected at the application level (HTTP 403).

### 4. Complete CRUD & Media Management

- Full CRUD for Books, Categories, and User accounts.
- Integrated file storage for book cover uploads via Laravel Storage (`storage:link`).
- Instant search by title, author, or ISBN, along with category-based filtering.

---

## 🛠️ Tech Stack

- **Backend:** PHP 8.2+, Laravel 11, Eloquent ORM, MySQL.
- **Authentication & RBAC:** Laravel Sanctum, Spatie Permission.
- **AI & ML Integration:** OpenAI Embeddings (`text-embedding-3-small`), OpenAI Chat Completions (`gpt-4o-mini`).
- **Frontend:** React 18, Vite, Tailwind CSS, Axios, Lucide Icons, React Router.

---

## 🚀 Quick Start & Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js (v18+) & npm
- MySQL Server (e.g., via XAMPP or Laravel Herd)

---

### Step 1: Backend Setup (Laravel)

1. Open your terminal in the backend directory:
   cd ai-library

2. Install PHP dependencies:
   composer install

3. Configure environment variables:
   copy .env.example .env
   (On Linux / macOS use: cp .env.example .env)

4. Generate the application key:
   php artisan key:generate

5. Configure database and AI keys in `.env`:
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ai_library
   DB_USERNAME=root
   DB_PASSWORD=

    OPENAI_API_KEY=sk-proj-your-openai-api-key-here

6. Run migrations and database seeders:
   php artisan migrate:fresh --seed

7. Generate vector embeddings for seeded books:
   php artisan books:generate-embeddings

8. Create the public storage link for book cover uploads:
   php artisan storage:link

9. Start the Laravel development server:
   php artisan serve
   (The API will run at http://127.0.0.1:8000)

---

### Step 2: Frontend Setup (React)

1. Open a new terminal in the frontend directory:
   cd ai-library-client

2. Install JavaScript dependencies:
   npm install

3. Launch the Vite development server:
   npm run dev
   (The client will run at http://localhost:5173)

---

## 🔑 Demo Credentials for Testing

| Role                  | Email             | Password    | Pre-configured Profile / Focus                               |
| :-------------------- | :---------------- | :---------- | :----------------------------------------------------------- |
| Admin                 | admin@library.com | password123 | Full access to Admin Panel, statistics, and book management  |
| User (AI Focus)       | sara@library.com  | password123 | Interests: AI, Machine Learning, Deep Learning, Python       |
| User (Security Focus) | omar@library.com  | password123 | Interests: Cyber Security, Ethical Hacking, Malware Analysis |
| User (Web Focus)      | karim@library.com | password123 | Interests: Web Development, React, UI/UX                     |
| User (Backend Focus)  | user@library.com  | password123 | Interests: PHP, Laravel, Backend Architecture                |

---

## 🧪 Demonstration & Test Scenarios

### Test Scenario A: Semantic AI Matching

1. Sign in as sara@library.com and switch to the "Recommended For You" tab.
    - Books like "Hands-On Machine Learning" will display an 85%+ Match.
2. Sign in as omar@library.com and view the recommendations.
    - Books like "The Web Application Hacker's Handbook" will rank first.
3. Update any user's profile interests in the /profile page to see the matching scores instantly adapt.

### Test Scenario B: Role-Aware Chatbot Security

1. Open the Ask AI Assistant drawer while logged in as a normal user (user@library.com).
2. Ask: "How many users are registered in the system?"
    - Result: The request is rejected with an Access Denied message (HTTP 403).
3. Log in as admin@library.com and ask the exact same question.
    - Result: The assistant delivers precise, real-time library counts and inventory analytics.
