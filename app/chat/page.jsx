"use client";

import { useState } from "react";

export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [chatName, setChatName] = useState("");
  const [description, setDescription] = useState("");

  const [showSavedChats, setShowSavedChats] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      let res;

      if (activeChatId) {
        res = await fetch(
          `http://localhost:5000/api/ai-chat/${activeChatId}/message`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ message: input }),
          }
        );
      } else {
        res = await fetch("http://localhost:5000/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          similarCases: data.similarCases || [],
        },
      ]);
    } catch (error) {
      console.error(error);
      alert("AI error");
    } finally {
      setLoading(false);
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

    await fetch(`http://localhost:5000/api/ai-chat/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setSavedChats((prev) => prev.filter((c) => c._id !== id));
  };

  const newChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setShowSavedChats(false);
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">

        {/* HEADER */}
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

        {/* SAVED CHAT LIST */}
        {showSavedChats && (
          <div className="mb-4 border p-3 rounded">
            <h2 className="font-semibold mb-2">Saved Chats</h2>

            {savedChats.map((chat) => (
              <div
                key={chat._id}
                className="p-2 border rounded mb-2 flex justify-between items-center hover:bg-gray-100"
              >
                <div
                  onClick={() => openChat(chat._id)}
                  className="cursor-pointer"
                >
                  <div className="font-medium">{chat.name}</div>
                  {chat.description && (
                    <div className="text-sm text-gray-500">
                      {chat.description}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteChat(chat._id)}
                  className="text-red-600 text-sm"
                >
                  🗑 Delete
                </button>
              </div>
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

              {/* Recommended Cases Section */}
              {msg.similarCases?.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-semibold text-gray-600 mb-2">
                    🔎 Recommended Cases
                  </div>

                  {msg.similarCases.map((caseItem, index) => (
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
            </div>
          ))}

          {loading && <p>AI is typing...</p>}
        </div>

        {/* INPUT */}
        <div className="flex gap-2">
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

      {/* SAVE MODAL */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-bold mb-4">
              Save This Chat
            </h2>

            <input
              placeholder="Chat name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              placeholder="Short description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveChat}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
