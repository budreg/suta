"use client";
import { motion } from "framer-motion";

const warna = ["#10b981", "#f59e0b", "#f43f5e", "#0ea5e9", "#8b5cf6"];

export default function Confetti({ count = 24 }) {
  const partikel = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    rotate: Math.random() * 360,
    color: warna[i % warna.length],
    delay: Math.random() * 0.15,
    size: 6 + Math.random() * 6,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden flex justify-center">
      {partikel.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, y: -10, x: 0, rotate: 0 }}
          animate={{ opacity: 0, y: 160, x: p.x, rotate: p.rotate }}
          transition={{ duration: 1.1, delay: p.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "20%",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}
