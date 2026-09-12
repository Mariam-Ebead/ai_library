import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [isAiMode, setIsAiMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchBooks = async () => {
        setLoading(true);
        try {
            if (isAiMode) {
                const res = await api.get("/recommendations");
                setBooks(res.data.books || []);
            } else {
                const res = await api.get(`/books?search=${search}`);
                setBooks(res.data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [isAiMode]);

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isAiMode ? "✨ AI Recommended Books" : "Library Catalog"}
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAiMode(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${!isAiMode ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        All Books
                    </button>
                    <button
                        onClick={() => setIsAiMode(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${isAiMode ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        Recommended For You (AI)
                    </button>
                </div>
            </div>

            {!isAiMode && (
                <div className="mb-6 flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by title, author, or ISBN..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-1/3 border rounded-lg px-4 py-2 text-sm"
                    />
                    <button
                        onClick={fetchBooks}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Search
                    </button>
                </div>
            )}

            {loading ? (
                <p className="text-gray-500">Loading catalog...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                        >
                            <div>
                                {/* صورة غلاف الكتاب */}
                                <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={
                                            book.cover_image ||
                                            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80"
                                        }
                                        alt={book.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src =
                                                "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80";
                                        }}
                                    />
                                    {book.match_percentage !== undefined && (
                                        <span className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                                            {book.match_percentage}% Match
                                        </span>
                                    )}
                                </div>

                                {/* تفاصيل الكتاب */}
                                <div className="p-5">
                                    <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mb-2">
                                        {book.category?.name}
                                    </span>
                                    <Link to={`/books/${book.id}`} className="hover:text-indigo-600 transition font-bold text-lg">
                                        {book.title}
                                    </Link>
                                    <p className="text-xs text-gray-500 mb-3">
                                        By {book.author}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {book.description}
                                    </p>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 flex justify-between items-center border-t border-gray-100 px-5 py-3 bg-gray-50/50">
                                <span>ISBN: {book.isbn}</span>
                                <span
                                    className={`font-semibold ${book.available_copies > 0 ? "text-green-600" : "text-red-500"}`}
                                >
                                    {book.available_copies > 0
                                        ? `${book.available_copies} Available`
                                        : "Out of stock"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
