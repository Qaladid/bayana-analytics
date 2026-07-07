"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, sessionId }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "Something went wrong." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 h-96 bg-[#0B1220] border border-[#1A1A1A] rounded-xl flex flex-col shadow-xl">
          <div className="flex items-center justify-between p-3 border-b border-[#1A1A1A]">
            <span className="text-white text-sm font-medium">Bayana Assistant</span>
            <button onClick={() => setOpen(false)}>
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  m.role === "user"
                    ? "bg-[#1D4ED8] text-white ml-auto"
                    : "bg-[#1A1A1A] text-white"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-[#1A1A1A] text-white/60 text-sm px-3 py-2 rounded-lg max-w-[80%]">
                Thinking...
              </div>
            )}
          </div>
          <div className="p-3 border-t border-[#1A1A1A] flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your data..."
              className="flex-1 bg-[#1A1A1A] text-white text-sm rounded-md px-2 py-1 outline-none"
            />
            <button onClick={sendMessage}>
              <Send className="w-4 h-4 text-[#1D4ED8]" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-[#1D4ED8] flex items-center justify-center shadow-lg"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}