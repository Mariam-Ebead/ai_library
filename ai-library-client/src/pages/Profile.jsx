import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        interests: user?.interests || "",
        skills: user?.skills || "",
        learning_goals: user?.learning_goals || "",
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const res = await api.put("/profile", formData);
            setUser(res.data.user);
            setMsg("Profile and AI preferences updated successfully!");
        } catch {
            setMsg("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Your Profile & AI Preferences
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Updating your interests and goals allows our Generative AI
                    to recommend relevant books tailored specifically to you.
                </p>

                {msg && (
                    <div className="bg-green-50 text-green-700 border border-green-200 text-sm p-3 rounded-lg mb-6">
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                            Interests
                        </label>
                        <input
                            type="text"
                            value={formData.interests}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    interests: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="e.g. Laravel, React, Cyber Security"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                            Current Skills
                        </label>
                        <input
                            type="text"
                            value={formData.skills}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    skills: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="e.g. PHP, Node.js, SQL"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                            Learning Goals
                        </label>
                        <textarea
                            rows={3}
                            value={formData.learning_goals}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    learning_goals: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="e.g. Master system architecture and clean code"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition"
                    >
                        {loading ? "Saving..." : "Save Preferences"}
                    </button>
                </form>
            </div>
        </div>
    );
}
