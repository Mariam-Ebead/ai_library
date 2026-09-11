import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        interests: "",
        skills: "",
        learning_goals: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/register", formData);
            localStorage.setItem("token", res.data.token);
            window.location.href = "/";
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    Create Account
                </h2>
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="password_confirmation"
                                required
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-2">
                        <h3 className="text-sm font-bold text-indigo-900 mb-2">
                            AI Personalization (Optional)
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Interests (e.g. Web Development, PHP, AI)
                                </label>
                                <input
                                    type="text"
                                    name="interests"
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    placeholder="Topics you enjoy reading"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Skills (e.g. JavaScript, Python)
                                </label>
                                <input
                                    type="text"
                                    name="skills"
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    placeholder="Your current skills"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Learning Goals
                                </label>
                                <input
                                    type="text"
                                    name="learning_goals"
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    placeholder="What do you want to learn next?"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition mt-4"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
