"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Hindari mismatch render server vs client (next-themes butuh ini)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-10 h-[22px]" />; // placeholder biar layout tidak "lompat"
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Ganti tema terang/gelap"
      className={`relative inline-flex h-[22px] w-10 shrink-0 items-center rounded-full
        transition-colors duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-slate-900
        ${isDark ? "bg-indigo-600" : "bg-slate-300"}`}
    >
      {/* Ikon latar (matahari & bulan) */}
      <span className="absolute left-1 flex items-center justify-center text-[9px] transition-opacity duration-300"
        style={{ opacity: isDark ? 0 : 1 }}
      >
        ☀️
      </span>
      <span className="absolute right-1 flex items-center justify-center text-[9px] transition-opacity duration-300"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        🌙
      </span>

      {/* Knob yang bergeser */}
      <span
        className={`inline-flex h-[18px] w-[18px] transform items-center justify-center rounded-full
          bg-white shadow-md transition-transform duration-300 ease-in-out
          ${isDark ? "translate-x-[19px]" : "translate-x-[2px]"}`}
      >
        <span className="text-[9px] transition-transform duration-300"
          style={{ transform: isDark ? "rotate(360deg)" : "rotate(0deg)" }}
        >
          {isDark ? "🌙" : "☀️"}
        </span>
      </span>
    </button>
  );
}