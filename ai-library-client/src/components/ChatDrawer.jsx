import { useState } from 'react';
import { MessageSquare, X, Send, Bot, ShieldAlert } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your AI Library Assistant. Ask me about books, recommendations, or library details!'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMsg = input.trim();

    setInput('');

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMsg
      }
    ]);

    setLoading(true);

    try {
      const res = await api.post('/chat', {
        message: userMsg
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.reply || res.data.message || 'No response'
        }
          ]);
    } catch (err) {
        const status = err.response?.status;
        const serverMsg = err.response?.data?.message;

        let errorMsg = serverMsg || 'An error occurred while connecting to the server.';
        if (status === 401) {
            errorMsg = 'Please log in first to use the AI assistant.';
        }

        setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: errorMsg, isError: true }
        ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-full shadow-2xl transition-all transform hover:scale-105"
        >
          <MessageSquare className="w-5 h-5" />

          <span className="font-semibold text-sm">
            Ask AI Assistant
          </span>
        </button>
      </div>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 max-w-[90vw] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">

          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />

              <h3 className="font-bold text-sm">
                Library AI Assistant
              </h3>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-100 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-sm">

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.role === 'user'
                    ? 'items-end'
                    : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : m.isError
                      ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-none flex items-start gap-1.5'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                  }`}
                >
                  {m.isError && (
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}

                  <span>{m.content}</span>
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="text-xs text-gray-400 italic">
                AI is thinking...
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t bg-white flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 disabled:opacity-50 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}