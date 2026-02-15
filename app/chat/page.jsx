"use client";

import { useState, useRef } from "react";

export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [latestCases, setLatestCases] = useState([]); // ✅ FIXED
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [chatName, setChatName] = useState("");
  const [description, setDescription] = useState("");

  const [showSavedChats, setShowSavedChats] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const [attachedDocs, setAttachedDocs] = useState([]);

  const fileInputRef = useRef(null);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/ai-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message: input }),
        }
      );

      const data = await res.json();

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      // Store recommended cases separately
      setLatestCases(data.similarCases || []);

    } catch (error) {
      console.error(error);
      alert("AI error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILE UPLOAD ================= */

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch(
        "http://localhost:5000/api/documents/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();
      const documentId = uploadData.document._id;

      await fetch(
        "http://localhost:5000/api/ai-chat/attach-document",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ documentId }),
        }
      );

      setAttachedDocs((prev) => [...prev, file.name]);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  /* ================= SAVE CHAT ================= */

  const saveChat = async () => {
    if (!chatName.trim()) {
      alert("Chat name required");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/ai-chat/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: chatName,
            description,
            messages,
          }),
        }
      );

      if (!res.ok) throw new Error();

      alert("Chat saved successfully!");
      setShowSaveModal(false);
      setChatName("");
      setDescription("");
    } catch {
      alert("Save failed");
    }
  };

  /* ================= LOAD SAVED CHATS ================= */

  const loadSavedChats = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/ai-chat/saved",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setSavedChats(data);
      setShowSavedChats(true);
    } catch {
      alert("Failed to load chats");
    }
  };

  const openChat = async (id) => {
    const res = await fetch(
      `http://localhost:5000/api/ai-chat/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();
    setMessages(data.messages);
    setActiveChatId(id);
    setShowSavedChats(false);
  };

  const deleteChat = async (id) => {
    if (!confirm("Delete this chat?")) return;

    await fetch(
      `http://localhost:5000/api/ai-chat/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setSavedChats((prev) =>
      prev.filter((c) => c._id !== id)
    );
  };

  const newChat = () => {
    setMessages([]);
    setLatestCases([]); // clear recommendations
    setActiveChatId(null);
    setAttachedDocs([]);
    setShowSavedChats(false);
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">

        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">
            🤖 AI Legal Assistant
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setShowSaveModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              💾 Save
            </button>

            <button
              onClick={loadSavedChats}
              className="bg-black text-white px-4 py-2 rounded"
            >
              📂 Saved Chats
            </button>

            <button
              onClick={newChat}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              + New
            </button>
          </div>
        </div>

        {/* ATTACHED DOCS */}
        {attachedDocs.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedDocs.map((doc, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
              >
                📎 {doc}
              </span>
            ))}
          </div>
        )}

        {/* MESSAGES */}
        <div className="h-96 overflow-y-auto border p-4 rounded mb-4 space-y-4">

          {messages.map((msg, i) => (
            <div key={i}>
              <div
                className={`px-4 py-2 rounded max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-black text-white ml-auto"
                    : "bg-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* ✅ Recommended cases always under latest message */}
          {latestCases.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-gray-600 mb-2">
                🔎 Recommended Cases
              </div>

              {latestCases.map((caseItem, index) => (
                <a
                  key={index}
                  href={caseItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border rounded p-3 mb-2 hover:bg-gray-100 transition"
                >
                  <div className="font-medium text-blue-600">
                    {caseItem.title}
                  </div>
                  <div className="text-xs text-gray-500 break-all">
                    {caseItem.link}
                  </div>
                </a>
              ))}
            </div>
          )}

          {loading && <p>AI is typing...</p>}

        </div>

        {/* INPUT */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-gray-300 px-4 py-2 rounded text-xl"
          >
            +
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="Ask legal question..."
          />

          <button
            onClick={sendMessage}
            className="bg-black text-white px-4 rounded"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
