"use client";
import { motion } from "framer-motion";

export default function ProgressBar({ value, max, color = "bg-emerald-500" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full">
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">{pct}% selesai</p>
    </div>
  );
}
