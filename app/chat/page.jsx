"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🆕 Case modal states
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [caseLoading, setCaseLoading] = useState(false);

  // ✅ wait for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔐 AUTH CHECK
  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem("token"); // ✅ FIXED
    if (!token) {
      router.push("/auth");
    }
  }, [mounted, router]);

  if (!mounted) return null;

  // ================= CHAT =================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("yl_token"); // ✅ FIXED
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
        { role: "ai", text: data.reply || data.message },
      ]);
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER CASE =================
  const createCase = async () => {
    if (!caseTitle.trim()) {
      alert("Case title is required");
      return;
    }

    const token = localStorage.getItem("yl_token"); // ✅ FIXED
    if (!token) {
      router.push("/auth");
      return;
    }

    setCaseLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: caseTitle,
          description: caseDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create case");
        return;
      }

      alert("✅ Case registered successfully!");
      setCaseTitle("");
      setCaseDescription("");
      setShowCaseModal(false);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setCaseLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>⚖️ AI Legal Chat</h2>

      <div style={{ marginBottom: 12, display: "flex", gap: 10 }}>
        <button
          onClick={() => router.push("/cases")}
          style={btnGreen}
        >
          📁 My Cases
        </button>

        <button
          onClick={() => setShowCaseModal(true)}
          style={btnBlue}
        >
          ➕ Register Case
        </button>
      </div>

      {/* 💬 Chat Box */}
      <div style={chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
        {loading && <p>AI is typing...</p>}
      </div>

      {/* ✍️ Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* 🪟 Case Modal */}
      {showCaseModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>📁 Register New Case</h3>

            <input
              placeholder="Case Title"
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              style={inputStyle}
            />

            <textarea
              placeholder="Case Description"
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              style={{ ...inputStyle, height: 80 }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowCaseModal(false)}>
                Cancel
              </button>

              <button
                onClick={createCase}
                disabled={caseLoading}
                style={btnGreen}
              >
                {caseLoading ? "Saving..." : "Save Case"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 Styles
const btnGreen = {
  padding: "8px 14px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const btnBlue = {
  padding: "8px 14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const chatBox = {
  border: "1px solid #ccc",
  padding: 16,
  minHeight: 350,
  marginBottom: 16,
  background: "#fafafa",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalBox = {
  background: "white",
  padding: 20,
  width: 350,
  borderRadius: 8,
};

const inputStyle = {
  width: "100%",
  padding: 8,
  marginBottom: 10,
};
