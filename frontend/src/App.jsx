import { useState, useRef, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I’m aTutorBot. Ask me anything to get started." },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "student1", message }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⚠️ ${data.error}` },
        ]);
      } else {
        setMessages(data.history);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Network error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-green-100">
      {/* Header */}
      <header className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-green-500 text-white py-5 shadow">
        <span className="text-4xl">📚</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
          TUTORBOT
        </h1>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full flex-shrink-0">
                🤖
              </div>
            )}

            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow text-sm sm:text-base whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full flex-shrink-0">
                🧑
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full flex-shrink-0">
              🤖
            </div>
            <div className="bg-white text-gray-700 px-4 py-2 rounded-2xl rounded-bl-none animate-pulse">
              Typing...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 bg-white border-t shadow-lg flex">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Type your question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 py-2 rounded-r-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
