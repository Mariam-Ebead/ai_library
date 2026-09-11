import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ChatDrawer from "./components/ChatDrawer";
import ProtectedRoute from "./components/ProtectedRoute";

import Books from "./pages/Books";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
                    <Navbar />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Books />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute requireAdmin={true}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                    {/* الشات بوت متاح دائماً في أسفل الشاشة */}
                    <ChatDrawer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}
