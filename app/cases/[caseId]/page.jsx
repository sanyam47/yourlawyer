"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CaseDetailPage() {
 const [timeline, setTimeline] = useState([]);
   
  const { caseId } = useParams();

  const [caseData, setCaseData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

 const [summary, setSummary] = useState("");
const [summaryLoading, setSummaryLoading] = useState(true);

const [onlineSources, setOnlineSources] = useState([]);
const [aiSuggestion, setAiSuggestion] = useState("");

const [onlineLoading, setOnlineLoading] = useState(true);
const [showSources, setShowSources] = useState(false);
const [showSuggestion, setShowSuggestion] = useState(false);



  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 🔄 Load everything
  useEffect(() => {
    const token = localStorage.getItem("token");

    async function loadData() {
      try {
        // 📁 Load case
        const caseRes = await fetch("http://localhost:5000/api/cases", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cases = await caseRes.json();
        const found = cases.find((c) => c._id === caseId);
        setCaseData(found);

        // 💬 Load messages
        const msgRes = await fetch(
          `http://localhost:5000/api/messages/${caseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const msgs = await msgRes.json();
        setMessages(msgs);

        // 🧠 Load summary
        const summaryRes = await fetch(
          `http://localhost:5000/api/summary/${caseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const summaryData = await summaryRes.json();
        setSummary(summaryData.summary || "");
        setSummaryLoading(false);

        // 🌍 Online Similar Cases Search
        if (found) {
          const query = `${found.title} ${found.description}`;

          const onlineRes = await fetch(
            `http://localhost:5000/api/online-recommendations?query=${encodeURIComponent(
              query
            )}`
          );

          const onlineData = await onlineRes.json();
          setOnlineSources(onlineData.sources || []);
          setAiSuggestion(onlineData.suggestion || "");
          setOnlineLoading(false);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load case data");
      }
    }

    loadData();
  }, [caseId]);

  // ✉️ Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    const text = input;
    setInput("");
    setSending(true);

    try {
      await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text, caseId }),
      });

      // Reload messages
      const msgRes = await fetch(
        `http://localhost:5000/api/messages/${caseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const msgs = await msgRes.json();
      setMessages(msgs);
    } catch (err) {
      alert("Server error");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p style={{ padding: 40 }}>Loading case...</p>;
  if (!caseData) return <p>Case not found</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2>📁 {caseData.title}</h2>
      <p>{caseData.description}</p>
      <small>Status: {caseData.status}</small>

      <hr style={{ margin: "30px 0" }} />

      {/* 🌍 Online Similar Cases */}
      <h3>🌍 Online Intelligence</h3>

<div style={box}>
  {/* Buttons */}
  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
    <button
      onClick={() => setShowSources(!showSources)}
      style={actionBtn}
    >
      🔎 {showSources ? "Hide Similar Cases" : "View Similar Cases"}
    </button>

    <button
      onClick={() => setShowSuggestion(!showSuggestion)}
      style={actionBtn}
    >
      🧠 {showSuggestion ? "Hide AI Strategy" : "View AI Strategy"}
    </button>
  </div>

  {/* Similar Cases */}
  {showSources && (
    <div style={innerBox}>
      {onlineLoading && <p>Searching online cases...</p>}

      {!onlineLoading && onlineSources.length === 0 && (
        <p>No online sources found.</p>
      )}

      {onlineSources.map((s, index) => (
        <div key={index} style={sourceItem}>
          <a
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            style={sourceLink}
          >
            🔗 {s.title}
          </a>
          <p style={sourceSnippet}>{s.snippet}</p>
        </div>
      ))}
    </div>
  )}

  {/* AI Suggestion */}
  {showSuggestion && (
    <div style={innerBox}>
      {!aiSuggestion && <p>No suggestion available.</p>}
      {aiSuggestion && (
        <p style={{ whiteSpace: "pre-line" }}>{aiSuggestion}</p>
      )}
    </div>
  )}

  <small style={{ color: "#777" }}>
    ⚠️ Informational only. Not legal advice.
  </small>
</div>


      <hr style={{ margin: "30px 0" }} />

      {/* 🧠 Case Summary */}
      <h3>🧠 Case Summary</h3>
      <div style={box}>
        {summaryLoading && <p>Generating summary...</p>}
        {!summaryLoading && summary && <p>{summary}</p>}
        {!summaryLoading && !summary && <p>No summary yet.</p>}
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* 💬 Chat */}
      <h3>💬 Case Chat</h3>

      <div style={chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{m.sender === "user" ? "You" : "AI"}:</strong>{" "}
            {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message for this case..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage} disabled={sending}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

// 🎨 Styles
const box = {
  border: "1px solid #ddd",
  background: "#f9fafb",
  padding: 14,
  borderRadius: 6,
};

const chatBox = {
  border: "1px solid #ddd",
  padding: 12,
  minHeight: 200,
  marginBottom: 10,
  background: "#fafafa",
};
const sourceItem = {
  marginBottom: 14,
  wordBreak: "break-word",
  overflowWrap: "anywhere",
};

const sourceLink = {
  fontWeight: "bold",
  color: "#2563eb",
  textDecoration: "underline",
  display: "block",
  maxWidth: "100%",
  whiteSpace: "normal",
  wordBreak: "break-word",
};

const sourceSnippet = {
  fontSize: 13,
  color: "#444",
  marginTop: 4,
  lineHeight: 1.4,
};
const actionBtn = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
};

const innerBox = {
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  padding: 12,
  borderRadius: 6,
  marginBottom: 12,
};
