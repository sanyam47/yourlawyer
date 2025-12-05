"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! I’m YourLawyer AI. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Mock AI reply after 1 sec
    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: "This is a mock AI reply. In the real version, I’ll use OpenAI/Claude API to answer legal queries.",
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
      {/* Header */}
      <header className="bg-[#13233F] text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">AI Legal Assistant</h1>
        <p className="text-sm opacity-80">Chat with YourLawyer AI for quick legal insights</p>
      </header>

      {/* Chat Window */}
      <main className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="bg-[#13233F] text-white p-3 rounded-xl max-w-[75%] shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={16} /> <span className="font-semibold text-sm">AI</span>
                </div>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            )}

            {msg.sender === "user" && (
              <div className="bg-blue-100 text-slate-900 p-3 rounded-xl max-w-[75%] shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <User size={16} /> <span className="font-semibold text-sm">You</span>
                </div>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>

      {/* Input Bar */}
      <footer className="border-t border-slate-200 bg-white p-4 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your legal question..."
          className="flex-1 border border-slate-300 rounded-md p-2 focus:outline-[#13233F]"
        />
        <button
          onClick={handleSend}
          className="bg-[#13233F] text-white px-4 py-2 rounded-md hover:bg-[#1a2b55] transition flex items-center gap-1"
        >
          <Send size={18} /> Send
        </button>
      </footer>
    </div>
  );
}

