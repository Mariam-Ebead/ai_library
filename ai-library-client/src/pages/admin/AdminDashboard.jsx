import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Plus, Trash2, Book, Users, FolderTree } from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("books");
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newBook, setNewBook] = useState({
        title: "",
        author: "",
        description: "",
        isbn: "",
        category_id: "",
        available_copies: 1,
        cover_image: "",
    });
    const [coverFile, setCoverFile] = useState(null);
    const loadData = async () => {
        try {
            const [bRes, cRes, uRes] = await Promise.all([
                api.get("/books"),
                api.get("/categories"),
                api.get("/users"),
            ]);
            setBooks(bRes.data.data || []);
            setCategories(cRes.data || []);
            setUsers(uRes.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory) return;
        await api.post("/categories", { name: newCategory });
        setNewCategory("");
        loadData();
    };

    const handleAddBook = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", newBook.title);
        formData.append("author", newBook.author);
        formData.append("description", newBook.description);
        formData.append("isbn", newBook.isbn);
        formData.append("category_id", newBook.category_id);
        formData.append("available_copies", newBook.available_copies);

        if (coverFile) {
            formData.append("cover_image", coverFile);
        }

        try {
            await api.post("/books", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setNewBook({
                title: "",
                author: "",
                description: "",
                isbn: "",
                category_id: "",
                available_copies: 1,
            });
            setCoverFile(null);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Error creating book");
        }
    };
    const handleDeleteBook = async (id) => {
        if (confirm("Delete this book?")) {
            await api.delete(`/books/${id}`);
            loadData();
        }
    };

    const handleDeleteUser = async (id) => {
        if (confirm("Delete this user?")) {
            await api.delete(`/users/${id}`);
            loadData();
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Admin Control Panel
            </h1>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <Book className="w-8 h-8 text-indigo-600" />
                    <div>
                        <p className="text-sm text-gray-500">Total Books</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {books.length}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <FolderTree className="w-8 h-8 text-amber-600" />
                    <div>
                        <p className="text-sm text-gray-500">Categories</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {categories.length}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <Users className="w-8 h-8 text-emerald-600" />
                    <div>
                        <p className="text-sm text-gray-500">
                            Registered Users
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {users.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 border-b mb-6">
                {["books", "categories", "users"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`capitalize py-2 px-4 font-semibold text-sm border-b-2 transition ${
                            activeTab === tab
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-500"
                        }`}
                    >
                        Manage {tab}
                    </button>
                ))}
            </div>

            {/* Books Tab */}
            {activeTab === "books" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <form
                        onSubmit={handleAddBook}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 h-fit"
                    >
                        <h3 className="font-bold text-gray-900 mb-2">
                            Add New Book
                        </h3>
                        <input
                            placeholder="Title"
                            required
                            value={newBook.title}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    title: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-1.5 text-sm"
                        />
                        <input
                            placeholder="Author"
                            required
                            value={newBook.author}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    author: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-1.5 text-sm"
                        />
                        <input
                            placeholder="ISBN"
                            required
                            value={newBook.isbn}
                            onChange={(e) =>
                                setNewBook({ ...newBook, isbn: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-1.5 text-sm"
                        />
                        <input
                            type="url"
                            placeholder="Cover Image URL (https://...)"
                            value={newBook.cover_image}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    cover_image: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-1.5 text-sm"
                        />
                        <select
                            required
                            value={newBook.category_id}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    category_id: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-1.5 text-sm"
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            min="0"
                            placeholder="Available Copies"
                            value={newBook.available_copies}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    available_copies: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-1.5 text-sm"
                        />
                        <textarea
                            placeholder="Description"
                            required
                            rows={3}
                            value={newBook.description}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    description: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-1.5 text-sm"
                        />
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Book Cover Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setCoverFile(e.target.files[0])
                                }
                                className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border rounded-lg p-1"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg text-sm hover:bg-indigo-700"
                        >
                            Create Book
                        </button>
                    </form>

                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 border-b">
                                <tr>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Copies</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((b) => (
                                    <tr
                                        key={b.id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3 font-medium">
                                            {b.title}
                                        </td>
                                        <td className="p-3 text-gray-500">
                                            {b.category?.name}
                                        </td>
                                        <td className="p-3">
                                            {b.available_copies}
                                        </td>
                                        <td className="p-3 text-right">
                                            <button
                                                onClick={() =>
                                                    handleDeleteBook(b.id)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <form
                        onSubmit={handleAddCategory}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 h-fit"
                    >
                        <h3 className="font-bold text-gray-900">
                            Add New Category
                        </h3>
                        <div className="flex gap-2">
                            <input
                                placeholder="Category Name"
                                required
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                    </form>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <h3 className="font-bold mb-3 text-sm text-gray-700">
                            Existing Categories
                        </h3>
                        <ul className="divide-y text-sm">
                            {categories.map((c) => (
                                <li
                                    key={c.id}
                                    className="py-2 flex justify-between"
                                >
                                    <span>{c.name}</span>
                                    <span className="text-gray-400 text-xs">
                                        {c.books_count ?? 0} books
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 border-b">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr
                                    key={u.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-3 font-medium">
                                        {u.name}
                                    </td>
                                    <td className="p-3 text-gray-500">
                                        {u.email}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.roles?.some((r) => r.name === "admin") ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}
                                        >
                                            {u.roles?.[0]?.name || "user"}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() =>
                                                handleDeleteUser(u.id)
                                            }
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
