import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, LogOut, User, Shield } from "lucide-react";

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-indigo-600 font-bold text-xl"
                >
                    <BookOpen className="w-6 h-6" />
                    <span>SmartLib AI</span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-indigo-600 text-sm font-medium"
                            >
                                Books
                            </Link>
                            <Link
                                to="/profile"
                                className="text-gray-700 hover:text-indigo-600 text-sm font-medium flex items-center gap-1"
                            >
                                <User className="w-4 h-4" /> Profile
                            </Link>
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 border border-amber-200"
                                >
                                    <Shield className="w-4 h-4" /> Admin Panel
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 ml-2"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-indigo-600 text-sm font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
