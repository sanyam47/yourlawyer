"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

export default function BookingChatPage() {
  const { bookingId } = useParams();
  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUserId(user?._id || user?.id);
    }
  }, []);

  useEffect(() => {
    if (!bookingId) return;

    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.emit("join_room", bookingId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === data._id)) return prev;
        return [...prev, data];
      });
    });

    return () => socket.disconnect();
  }, [bookingId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current.emit("send_message", {
      bookingId,
      senderId: currentUserId,
      message,
    });

    setMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 flex flex-col h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">💬 Chat</h1>

      <div className="flex-1 border rounded p-4 overflow-y-auto bg-gray-100 space-y-3">
        {messages.map((msg) => {
          const isMine =
            String(msg.sender) === String(currentUserId);

          return (
            <div
              key={msg._id || Math.random()}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                  isMine
                    ? "bg-black text-white rounded-br-none"
                    : "bg-white text-black border rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border p-2 rounded-full px-4"
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-6 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
