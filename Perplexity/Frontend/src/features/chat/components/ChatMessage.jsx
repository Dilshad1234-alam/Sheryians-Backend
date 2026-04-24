import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = ({ message, setChatInput }) => {
  return (
    <div
      className={`w-full ${
        message.role === "user" ? "flex justify-end" : "flex justify-start"
      }`}
    >
      <div
        className={`max-w-[90%] rounded-3xl px-4 py-3 text-sm md:max-w-[85%] md:text-[15px] ${
          message.role === "user"
            ? "rounded-br-md bg-[#111827] text-white shadow-sm dark:bg-[#2563eb]"
            : "rounded-bl-md border border-black/5 bg-[#faf8f4] text-[#202020] dark:border-white/10 dark:bg-[#171d25] dark:text-white/90"
        }`}
      >
        {message.role === "user" ? (
          <p className="whitespace-pre-wrap leading-7">{message.content}</p>
        ) : (
          <div className="space-y-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-2 leading-7 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-2 list-disc pl-5">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-2 list-decimal pl-5">{children}</ol>
                ),
                code: ({ inline, children }) =>
                  inline ? (
                    <code className="rounded-lg bg-black/5 px-1.5 py-0.5 text-sm dark:bg-white/10">
                      {children}
                    </code>
                  ) : (
                    <code className="text-sm">{children}</code>
                  ),
                pre: ({ children }) => (
                  <pre className="overflow-x-auto rounded-2xl bg-[#ece7dc] p-4 dark:bg-black/30">
                    {children}
                  </pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-600 underline dark:text-blue-300"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>

            {message.sources?.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2">
                {message.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-black/5 bg-white p-4 transition hover:bg-[#f5f1e8] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <p className="text-sm font-semibold">{source.title}</p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {source.snippet}
                    </p>
                  </a>
                ))}
              </div>
            )}

            {message.suggestions?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {message.suggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setChatInput(item)}
                    className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs text-neutral-700 transition hover:bg-[#f4f0e7] dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;