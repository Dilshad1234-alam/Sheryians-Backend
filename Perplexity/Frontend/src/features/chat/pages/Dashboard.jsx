import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import { useTheme } from "../hook/useTheme";
import { useChat } from "../hook/useChat";
import { resetCurrentChat } from "../chat.slice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const chat = useChat();
  const { theme, toggleTheme } = useTheme();

  const [chatInput, setChatInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const error = useSelector((state) => state.chat.error);

  const currentMessages = useMemo(() => {
    return chats[currentChatId]?.messages || [];
  }, [chats, currentChatId]);

  useEffect(() => {
    const socket = chat.initializeSocketConnection();
    chat.setupSocketListeners();
    chat.handleGetChats();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    await chat.handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId,
    });

    setChatInput("");
  };

  const openChat = async (chatId) => {
    await chat.handleOpenChat(chatId);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    dispatch(resetCurrentChat());
    setChatInput("");
    setSidebarOpen(false);
  };

  return (
    <main className="h-screen w-full bg-[#f6f4ef] p-3 text-[#1f1f1c] transition-colors duration-300 dark:bg-[#0b0f14] dark:text-[#f3f4f6] md:p-5">
      <section className="mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 md:h-[calc(100vh-2.5rem)] md:gap-6">
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onOpenChat={openChat}
          onDeleteChat={chat.handleDeleteChat}
          onNewChat={handleNewChat}
        />

        <section className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-[0_16px_60px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-[#11161d] dark:shadow-none">
          <header className="flex items-center justify-between border-b border-black/5 px-4 py-4 dark:border-white/10 md:px-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-[#f7f3eb] text-lg md:hidden dark:border-white/10 dark:bg-white/5"
              >
                ☰
              </button>

              <div>
                <h2 className="text-lg font-semibold">
                  {currentChatId ? chats[currentChatId]?.title || "Chat" : "Ask anything"}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Professional AI search workspace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-black/5 bg-[#f8f6f1] px-4 py-2 text-sm text-neutral-600 md:block dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                Scheduled
              </div>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </header>

          <div className="messages flex-1 space-y-4 overflow-y-auto px-4 py-6 pb-40 md:px-5">
            {!currentChatId && (
              <div className="mx-auto mt-10 max-w-3xl text-center md:mt-14">
                <div className="mx-auto mb-6 inline-flex rounded-full border border-[#d9d2c7] bg-[#f7f2e9] px-4 py-2 text-sm text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                  Pro · Search and reasoning assistant
                </div>

                <h3 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  Ask anything
                </h3>

                <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-400">
                  Research, explain, compare, and explore ideas in a more professional workspace.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            )}

            {currentMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                setChatInput={setChatInput}
              />
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-black/5 bg-[#faf8f4] px-4 py-3 text-sm text-neutral-500 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <footer className="absolute bottom-0 left-0 right-0 border-t border-black/5 bg-white/90 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#11161d]/90">
            <form
              onSubmit={handleSubmitMessage}
              className="mx-auto flex max-w-4xl flex-col gap-3 md:flex-row"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask anything..."
                className="w-full rounded-[24px] border border-black/10 bg-[#f8f6f1] px-5 py-4 text-base outline-none transition placeholder:text-neutral-400 focus:border-[#cfc7ba] dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 dark:focus:border-white/20"
              />

              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading}
                className="rounded-[24px] bg-[#111827] px-6 py-4 text-base font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-[#111827] dark:hover:bg-neutral-200"
              >
                Send
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-neutral-400 dark:text-neutral-500">
              Premium working professional chat interface
            </p>
          </footer>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;


