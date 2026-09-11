import { useState } from "react";
import api from "../api/axios";
import { MessageSquare, X, Send } from "lucide-react";

export default function ChatDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello! I am your AI Library Assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.post("/chat", { message: userMsg });
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: res.data.reply },
            ]);
        } catch (err) {
            const errorReply =
                err.response?.data?.reply || "Error connecting to AI service.";
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: errorReply, isError: true },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl flex items-center gap-2"
                >
                    <MessageSquare className="w-6 h-6" />
                    <span className="font-semibold">Ask AI Assistant</span>
                </button>
            )}

            {isOpen && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col overflow-hidden">
                    <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" /> Library AI
                        </h3>
                        <button onClick={() => setIsOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                                        m.sender === "user"
                                            ? "bg-indigo-600 text-white"
                                            : m.isError
                                              ? "bg-red-100 text-red-700 border border-red-200"
                                              : "bg-white text-gray-800 border border-gray-200"
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="text-xs text-gray-400">
                                AI is thinking...
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={sendMessage}
                        className="p-3 bg-white border-t border-gray-200 flex gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about books or recommendations..."
                            className="flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white p-2 rounded-lg"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
