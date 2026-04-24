import React from "react";

const Sidebar = ({
  chats,
  currentChatId,
  sidebarOpen,
  setSidebarOpen,
  onOpenChat,
  onDeleteChat,
  onNewChat,
}) => {
  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={`fixed left-3 top-3 z-40 h-[calc(100vh-1.5rem)] w-[280px] rounded-[28px] border border-black/5 bg-white/90 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur transition-all duration-300 ease-out dark:border-white/10 dark:bg-[#11161d]/95 md:static md:flex md:h-full md:w-80 md:translate-x-0 md:flex-col ${
          sidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-[120%] opacity-0 md:opacity-100"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Perplexity</h1>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Working Professional UI
            </p>
          </div>

          <button
            type="button"
            onClick={onNewChat}
            className="rounded-xl border border-black/10 bg-[#f2efe8] px-3 py-2 text-sm font-medium text-[#222] transition hover:bg-[#ebe6dc] dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            + New
          </button>
        </div>

        <div className="mb-4 rounded-2xl border border-black/5 bg-[#f8f6f1] p-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            Recent
          </p>
          <p className="mt-2 text-sm font-medium">Your conversations</p>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {Object.values(chats).length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-[#f8f6f1] p-4 text-sm text-neutral-500 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
              No chats yet. Start a new conversation.
            </div>
          ) : (
            Object.values(chats).map((chatItem) => (
              <div
                key={chatItem.id}
                className={`rounded-2xl border p-3 transition ${
                  currentChatId === chatItem.id
                    ? "border-[#d8d2c7] bg-[#f3efe6] dark:border-white/15 dark:bg-white/10"
                    : "border-black/5 bg-white hover:bg-[#f7f4ed] dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                }`}
              >
                <button
                  onClick={() => onOpenChat(chatItem.id)}
                  type="button"
                  className="w-full text-left"
                >
                  <p className="truncate text-sm font-semibold">{chatItem.title}</p>
                  <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">
                    Open conversation
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteChat(chatItem.id)}
                  className="mt-3 text-xs font-medium text-red-500 transition hover:text-red-600 dark:text-red-300 dark:hover:text-red-200"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;