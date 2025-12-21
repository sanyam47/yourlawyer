"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ wait for client hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔐 auth check AFTER mount
  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem("yl_token");
    if (!token) {
      router.push("/auth");
    }
  }, [mounted, router]);

  if (!mounted) return null; // ⛔ prevent premature redirect

  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("yl_token");
    if (!token) {
      router.push("/auth");
      return;
    }

    const userMessage = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
    { role: "user", text: userMessage },
    ]);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Chat failed");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply },
      ]);
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>AI Legal Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 16,
          minHeight: 350,
          marginBottom: 16,
          background: "#fafafa",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
            {msg.text}
          </div>
        ))}

        {loading && <p>AI is typing...</p>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
