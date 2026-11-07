
"use client";

import React, { useState, useRef, useEffect } from "react";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // SEND MESSAGE WITH STREAMING
  const sendMessage = async (customMessage) => {
    const messageText = (customMessage || input).trim();

    if (!messageText || loading) return;

    const userMessage = {
      role: "user",
      text: messageText,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        text: "",
      },
    ]);

    setInput("");
    setLoading(true);
    setSidebarOpen(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.slice(-10),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Something went wrong");
      }

      if (!response.body) {
        throw new Error("Streaming is not supported.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullReply = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        fullReply += decoder.decode(value, {
          stream: true,
        });

        setMessages((previous) => {
          const updated = [...previous];

          updated[updated.length - 1] = {
            role: "assistant",
            text: fullReply,
          };

          return updated;
        });
      }

      fullReply += decoder.decode();

      if (fullReply) {
        setMessages((previous) => {
          const updated = [...previous];

          updated[updated.length - 1] = {
            role: "assistant",
            text: fullReply,
          };

          return updated;
        });
      }

    } catch (error) {
      console.error("NexAi Error:", error);

      setMessages((previous) => {
        const updated = [...previous];

        updated[updated.length - 1] = {
          role: "assistant",
          text: `Sorry! ${error.message}`,
        };

        return updated;
      });

    } finally {
      setLoading(false);
    }
  };

  // NEW CHAT
  const newChat = () => {
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
  };

  // SUGGESTIONS
  const suggestions = [
    {
      icon: "💻",
      title: "Learn Programming",
      description: "Learn coding in simple words.",
      prompt: "Teach me programming in simple words.",
    },
    {
      icon: "🌐",
      title: "Build a Website",
      description: "Create a modern responsive website.",
      prompt: "Help me build a modern responsive website.",
    },
    {
      icon: "⚡",
      title: "Generate Code",
      description: "Write clean and useful code.",
      prompt: "Help me write clean JavaScript code.",
    },
    {
      icon: "💡",
      title: "Creative Ideas",
      description: "Discover something new and exciting.",
      prompt: "Give me some creative web development project ideas.",
    },
  ];

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#fafafa] text-[#202020]">

      {/* BACKGROUND GRAPHICS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[120px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-red-400/10 blur-[120px]" />

        <div className="absolute right-[25%] top-[20%] h-64 w-64 rounded-full bg-orange-300/10 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />

        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full border border-red-500/10" />
        <div className="absolute -right-10 top-32 h-52 w-52 rounded-full border border-red-500/10" />

      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-red-100 bg-white/95 p-5 shadow-2xl shadow-red-900/5 backdrop-blur-2xl transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* LOGO */}
        <div className="mb-10 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-2xl text-white shadow-lg shadow-red-500/30">
              ✦
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-red-600">
                NexAi
              </h1>

              <p className="text-[9px] font-bold tracking-[3px] text-gray-400">
                AI ASSISTANT
              </p>
            </div>

          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-red-50 md:hidden"
          >
            ✕
          </button>

        </div>

        {/* NEW CHAT */}
        <button
          onClick={newChat}
          className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-red-500/40"
        >
          <span className="text-xl transition-transform group-hover:rotate-90">
            ＋
          </span>
          New Conversation
        </button>

        {/* CHAT HISTORY */}
        <div className="mt-10 flex-1 overflow-y-auto">

          <p className="mb-4 px-2 text-[10px] font-extrabold uppercase tracking-[3px] text-gray-400">
            Recent Conversations
          </p>

          {messages.length > 0 ? (

            <div className="rounded-xl border border-red-100 bg-red-50/60 px-3 py-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-red-500">💬</span>
                <span className="truncate">
                  {messages[0].text}
                </span>
              </div>
            </div>

          ) : (

            <p className="px-2 text-xs leading-6 text-gray-400">
              Your conversations will appear here.
            </p>

          )}

        </div>

        {/* DEVELOPER PROFILE */}
        <div className="border-t border-gray-100 pt-5">

          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-white p-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-lg font-black text-white shadow-md shadow-red-500/20">
              A
            </div>

            <div>
              <p className="text-sm font-bold text-gray-800">
                Ali Hassan
              </p>

              <p className="text-xs text-gray-500">
                Project Developer
              </p>
            </div>

          </div>

          {/* SIR CREDIT */}
          <div className="rounded-xl border border-red-100 bg-white p-3 text-center">

            <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
              Special Thanks & Credits
            </p>

            <p className="mt-2 text-sm font-extrabold text-red-600">
              Sir Zeeshan Ali
            </p>

          </div>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex min-w-0 flex-1 flex-col">

        {/* HEADER */}
        <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-red-100 bg-white/80 px-4 shadow-sm shadow-red-900/[0.02] backdrop-blur-xl md:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-red-100 bg-white p-2.5 text-red-600 shadow-sm transition hover:bg-red-50 md:hidden"
            >
              ☰
            </button>

            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
                NexAi
              </h2>

              <p className="text-[10px] text-gray-400">
                Your Intelligent AI Companion
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

            <span className="text-[10px] font-bold text-green-700 md:text-xs">
              Gemini 3.8 Flash
            </span>

          </div>

        </header>

        {/* CHAT SECTION */}
        <section className="nx-scroll flex-1 overflow-y-auto px-4 py-8 md:px-10">

          {messages.length === 0 ? (

            /* WELCOME SCREEN */
            <div className="flex min-h-full flex-col items-center justify-center py-10 text-center">

              {/* HERO LOGO */}
              <div className="relative mb-8">

                <div className="absolute inset-0 rounded-[35px] bg-red-500/30 blur-2xl" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] border border-red-200 bg-gradient-to-br from-red-500 to-red-700 text-5xl text-white shadow-2xl shadow-red-500/30">
                  ✦
                </div>

                <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#fafafa] bg-white text-lg shadow-md">
                  ⚡
                </div>

              </div>

              {/* WELCOME LABEL */}
              <div className="mb-5 rounded-full border border-red-200 bg-red-50 px-5 py-2">

                <p className="text-[10px] font-extrabold tracking-[3px] text-red-600">
                  ✨ WELCOME TO NEXAI
                </p>

              </div>

              {/* MAIN HEADING */}
              <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-gray-900 md:text-6xl">

                Think Beyond.
                <br />

                <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-400 bg-clip-text text-transparent">
                  Create With AI.
                </span>

              </h1>

              <p className="max-w-lg text-sm leading-7 text-gray-500 md:text-base">
                Meet your intelligent AI companion. Ask questions,
                explore ideas, write code and turn your imagination
                into reality.
              </p>

              {/* SUGGESTION CARDS */}
              <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">

                {suggestions.map((item, index) => (

                  <button
                    key={index}
                    onClick={() => setInput(item.prompt)}
                    className="group rounded-2xl border border-gray-200 bg-white/90 p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-xl hover:shadow-red-500/10"
                  >

                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-2xl transition duration-300 group-hover:scale-110 group-hover:bg-red-100">
                      {item.icon}
                    </div>

                    <h3 className="mb-2 text-sm font-extrabold text-gray-800 transition group-hover:text-red-600">
                      {item.title}
                    </h3>

                    <p className="text-xs leading-5 text-gray-500">
                      {item.description}
                    </p>

                  </button>

                ))}

              </div>

              <p className="mt-10 text-[10px] font-bold tracking-[3px] text-gray-300">
                POWERED BY GEMINI AI
              </p>

            </div>

          ) : (

            /* CHAT MESSAGES */
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">

              {messages.map((message, index) => (

                <div
                  key={index}
                  className={`flex gap-3 md:gap-4 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {/* AI AVATAR */}
                  {message.role === "assistant" && (

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-xl text-white shadow-lg shadow-red-500/20">
                      ✦
                    </div>

                  )}

                  {/* MESSAGE BUBBLE */}
                  <div
                    className={`max-w-[88%] break-words rounded-2xl px-4 py-4 text-sm leading-7 md:max-w-[80%] md:px-5 ${
                      message.role === "user"
                        ? "rounded-br-sm bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg shadow-red-500/15"
                        : "rounded-tl-sm border border-gray-200 bg-white text-gray-700 shadow-sm"
                    }`}
                  >

                    {message.text ? (

                      <div className="whitespace-pre-wrap">
                        {message.text}
                      </div>

                    ) : (

                      <div className="flex items-center gap-2 py-1">

                        <span className="h-2 w-2 animate-bounce rounded-full bg-red-500" />

                        <span className="h-2 w-2 animate-bounce rounded-full bg-red-400 [animation-delay:150ms]" />

                        <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:300ms]" />

                        <span className="ml-2 text-xs text-gray-400">
                          NexAi is thinking...
                        </span>

                      </div>

                    )}

                    {message.role === "assistant" &&
                      message.text &&
                      loading &&
                      index === messages.length - 1 && (

                        <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-red-500 align-middle" />

                      )}

                  </div>

                  {/* USER AVATAR */}
                  {message.role === "user" && (

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-sm font-black text-red-600">
                      U
                    </div>

                  )}

                </div>

              ))}

              <div ref={bottomRef} />

            </div>

          )}

        </section>

        {/* INPUT AREA */}
        <div className="shrink-0 px-3 pb-5 pt-3 md:px-8">

          <div className="mx-auto max-w-4xl">

            <div className="flex items-end gap-3 rounded-[25px] border border-gray-200 bg-white p-3 shadow-xl shadow-red-900/[0.05] transition duration-300 focus-within:border-red-300 focus-within:shadow-red-500/10">

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);

                  e.target.style.height = "auto";

                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 160) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message NexAi..."
                rows={1}
                className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400"
              />

              {/* SEND BUTTON */}
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-500 text-2xl font-bold text-white shadow-lg shadow-red-500/30 transition duration-300 hover:scale-105 hover:shadow-red-500/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                ↑
              </button>

            </div>

            {/* FOOTER */}
            <p className="mt-4 text-center text-[10px] text-gray-400">
              NexAi can make mistakes. Verify important information.
            </p>

            <p className="mt-1 text-center text-[10px] text-gray-400">
              Developed by{" "}
              <span className="font-bold text-red-600">
                Ali Hassan
              </span>
              {" "} | Special Credits:{" "}
              <span className="font-bold text-red-600">
                Sir Zeeshan Ali
              </span>
              {" "}© 2026
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}
