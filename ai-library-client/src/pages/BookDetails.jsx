import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Hash,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
  BookmarkCheck,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // حالات الاستعارة
  const [borrowing, setBorrowing] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [feedback, setFeedback] = useState({
    message: '',
    type: '',
  });

  useEffect(() => {
    const fetchBookAndStatus = async () => {
      try {
        setLoading(true);

        // جلب بيانات الكتاب
        const res = await api.get(`/books/${id}`);
        setBook(res.data);

        // إذا كان المستخدم مسجل دخول، نفحص هل استعاره مسبقاً
        if (user) {
          try {
            const statusRes = await api.get(`/books/${id}/borrow-status`);
            setIsBorrowed(statusRes.data.is_borrowed);
          } catch (e) {
            // في حالة عدم التسجيل أو انتهاء التوكن
            setIsBorrowed(false);
          }
        } else {
          setIsBorrowed(false);
        }
      } catch (err) {
        setError('Book not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndStatus();
  }, [id, user]);

  const handleBorrow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBorrowing(true);
    setFeedback({
      message: '',
      type: '',
    });

    try {
      const res = await api.post(`/books/${id}/borrow`);

      setFeedback({
        message: res.data.message,
        type: 'success',
      });

      setIsBorrowed(true);

      // تحديث عدد النسخ في الواجهة فوراً
      setBook((prev) => ({
        ...prev,
        available_copies: res.data.available_copies,
      }));
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to borrow the book.';

      setFeedback({
        message: msg,
        type: 'error',
      });
    } finally {
      setBorrowing(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Error / Book not found
  if (error || !book) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Oops!
        </h2>

        <p className="text-gray-600 mb-6">
          {error || 'Book could not be found.'}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Cover image URL
  const coverUrl = book.cover_image
    ? book.cover_image.startsWith('http')
      ? book.cover_image
      : `http://127.0.0.1:8000/storage/${book.cover_image}`
    : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="max-w-5xl mx-auto py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to books
      </button>

      {/* Success / Error Feedback */}
      {feedback.message && (
        <div
          className={`mb-6 p-4 rounded-2xl border text-sm font-medium transition ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Main Book Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">

          {/* Cover & Stock Status */}
          <div className="md:col-span-4 flex flex-col items-center">

            <div className="w-full aspect-[3/4] max-w-[280px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 relative group">

              <img
                src={coverUrl}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600';
                }}
              />

            </div>

            {/* Available Copies */}
            <div className="mt-5 w-full max-w-[280px]">

              {book.available_copies > 0 ? (
                <div className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-semibold">

                  <CheckCircle2 className="w-4 h-4" />

                  <span>
                    Available ({book.available_copies} copies)
                  </span>

                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2 px-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-sm font-semibold">

                  <XCircle className="w-4 h-4" />

                  <span>Out of Stock</span>

                </div>
              )}

            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-8 flex flex-col justify-between">

            <div>

              {/* Category */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold uppercase tracking-wider mb-3">

                <Layers className="w-3.5 h-3.5" />

                {book.category?.name || 'General'}

              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                {book.title}
              </h1>

              {/* Author */}
              <p className="text-lg text-gray-600 font-medium mb-6">
                By{' '}
                <span className="text-indigo-600">
                  {book.author}
                </span>
              </p>

              {/* Book Information */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">

                {/* ISBN */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">

                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">

                    <Hash className="w-3.5 h-3.5 text-gray-400" />

                    ISBN

                  </span>

                  <span className="text-sm font-semibold text-gray-800">
                    {book.isbn || 'N/A'}
                  </span>

                </div>

                {/* Copies */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">

                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">

                    <BookOpen className="w-3.5 h-3.5 text-gray-400" />

                    Copies Left

                  </span>

                  <span className="text-sm font-semibold text-gray-800">
                    {book.available_copies}
                  </span>

                </div>

                {/* AI Vector */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 col-span-2 sm:col-span-1">

                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">

                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />

                    AI Vector

                  </span>

                  <span className="text-xs font-semibold text-emerald-600">
                    {book.embedding
                      ? 'Embedded (1536-d)'
                      : 'Standard'}
                  </span>

                </div>

              </div>

              {/* Description */}
              <div className="mb-6">

                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Overview & Synopsis
                </h3>

                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                  {book.description ||
                    'No description available for this book.'}
                </p>

              </div>

            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center gap-3">

              {/* Already Borrowed */}
              {isBorrowed ? (
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold shadow-sm opacity-90 cursor-not-allowed"
                >
                  <BookmarkCheck className="w-5 h-5" />
                  Currently Borrowed by You
                </button>
              ) : (

                /* Borrow Button */
                <button
                  onClick={handleBorrow}
                  disabled={
                    book.available_copies <= 0 || borrowing
                  }
                  className="flex items-center justify-center gap-2 min-w-[170px] px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-sm transition"
                >

                  {borrowing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Borrowing...
                    </>
                  ) : book.available_copies <= 0 ? (
                    'Out of Stock'
                  ) : (
                    'Borrow This Book'
                  )}

                </button>
              )}

              {/* Browse More */}
              <Link
                to="/"
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition text-center"
              >
                Browse More
              </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}