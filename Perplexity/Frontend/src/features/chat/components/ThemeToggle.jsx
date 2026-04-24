import React from "react";

const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex h-11 w-24 items-center justify-between rounded-full border border-black/10 bg-white px-1.5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/10"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
          theme === "light"
            ? "bg-neutral-900 text-white shadow"
            : "text-neutral-500 dark:text-neutral-300"
        }`}
      >
        ☀
      </span>

      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
          theme === "dark"
            ? "bg-neutral-900 text-white shadow dark:bg-white dark:text-neutral-900"
            : "text-neutral-500"
        }`}
      >
        ☾
      </span>
    </button>
  );
};

export default ThemeToggle;