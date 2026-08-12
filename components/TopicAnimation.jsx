"use client";
import { motion } from "framer-motion";

/**
 * Animasi 2D edukatif berbasis SVG + framer-motion.
 * Setiap topik materi punya adegan animasi loop yang menggambarkan
 * konsepnya secara visual, sebagai pelengkap teks & video.
 */

const loop = (duration, extra = {}) => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut",
  ...extra,
});

/* ---------- 1. Penyebab DM: glukosa menumpuk di darah, reseptor "terkunci" ---------- */
function PenyebabDMScene() {
  const glukosa = Array.from({ length: 6 }, (_, i) => i);
  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      {/* pembuluh darah */}
      <rect x="0" y="60" width="300" height="40" rx="20" fill="#fecaca" opacity="0.5" />
      {/* sel dengan reseptor terkunci */}
      <circle cx="240" cy="80" r="34" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
      <motion.rect
        x="222"
        y="72"
        width="16"
        height="16"
        rx="3"
        fill="#b91c1c"
        animate={{ rotate: [0, 8, -8, 0] }}
        transition={loop(2)}
        style={{ transformOrigin: "230px 80px" }}
      />
      <text x="240" y="126" textAnchor="middle" fontSize="10" fill="#7f1d1d" fontWeight="600">
        Sel resisten insulin
      </text>

      {/* partikel glukosa mengambang, gagal masuk sel */}
      {glukosa.map((i) => (
        <motion.circle
          key={i}
          r="6"
          fill="#f59e0b"
          initial={{ cx: 20 + i * 30, cy: 80 }}
          animate={{
            cx: [20 + i * 30, 190, 170, 190],
            cy: [80, 80, 60, 100],
          }}
          transition={loop(3 + i * 0.2, { delay: i * 0.25 })}
        />
      ))}
      <text x="60" y="30" fontSize="10" fill="#92400e" fontWeight="600">
        Glukosa menumpuk di darah
      </text>
    </svg>
  );
}

/* ---------- 2. Pola Makan Sehat: piring terisi sesuai porsi "Isi Piringku" ---------- */
function PolaMakanScene() {
  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      <circle cx="150" cy="85" r="60" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      {/* sayur & buah - setengah piring */}
      <motion.path
        d="M150 85 L150 25 A60 60 0 0 1 150 145 Z"
        fill="#22c55e"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        style={{ transformOrigin: "150px 85px" }}
      />
      {/* karbohidrat - seperempat */}
      <motion.path
        d="M150 85 L150 25 A60 60 0 0 0 96.6 55 Z"
        fill="#f59e0b"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ transformOrigin: "150px 85px" }}
      />
      {/* protein - seperempat */}
      <motion.path
        d="M150 85 L96.6 55 A60 60 0 0 0 150 145 Z"
        fill="#ef4444"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        style={{ transformOrigin: "150px 85px" }}
      />
      <text x="150" y="10" textAnchor="middle" fontSize="11" fill="#334155" fontWeight="700">
        Prinsip Isi Piringku
      </text>
      <text x="220" y="35" fontSize="9" fill="#166534">Sayur & buah</text>
      <text x="215" y="150" fontSize="9" fill="#7f1d1d">Protein</text>
      <text x="60" y="45" fontSize="9" fill="#92400e">Karbo</text>
    </svg>
  );
}

/* ---------- 3. Aktivitas Fisik: figur jalan/lari, gula darah turun ---------- */
function AktivitasFisikScene() {
  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      {/* figur orang berlari (stick figure) bergerak melintasi layar */}
      <motion.g
        animate={{ x: [0, 200, 0] }}
        transition={loop(4)}
      >
        <motion.g
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={loop(0.6)}
          style={{ transformOrigin: "30px 70px" }}
        >
          <circle cx="30" cy="45" r="8" fill="#0ea5e9" />
          <line x1="30" y1="53" x2="30" y2="80" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="60" x2="18" y2="72" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="60" x2="44" y2="50" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="80" x2="16" y2="100" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="80" x2="44" y2="98" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
        </motion.g>
      </motion.g>

      {/* garis tanah */}
      <line x1="0" y1="110" x2="300" y2="110" stroke="#cbd5e1" strokeWidth="2" />

      {/* grafik gula darah menurun seiring aktivitas */}
      <text x="150" y="20" textAnchor="middle" fontSize="10" fill="#334155" fontWeight="700">
        Aktivitas fisik menurunkan gula darah
      </text>
      <g transform="translate(150,55)">
        <rect x="0" y="0" width="120" height="12" rx="6" fill="#e2e8f0" />
        <motion.rect
          x="0"
          y="0"
          height="12"
          rx="6"
          fill="#0ea5e9"
          initial={{ width: 120 }}
          animate={{ width: [120, 40, 120] }}
          transition={loop(4)}
        />
        <text x="0" y="-6" fontSize="8" fill="#0369a1">Kadar gula darah</text>
      </g>
    </svg>
  );
}

/* ---------- 4. Manajemen Stres: lingkaran napas & gelombang otak tenang ---------- */
function ManajemenStresScene() {
  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      <text x="150" y="20" textAnchor="middle" fontSize="10" fill="#334155" fontWeight="700">
        Tarik napas... buang napas...
      </text>
      {/* lingkaran napas mengembang & mengempis */}
      <motion.circle
        cx="150"
        cy="90"
        r="30"
        fill="#a78bfa"
        opacity="0.5"
        animate={{ r: [24, 42, 24] }}
        transition={loop(4)}
      />
      <motion.circle
        cx="150"
        cy="90"
        r="20"
        fill="#8b5cf6"
        animate={{ r: [16, 28, 16] }}
        transition={loop(4)}
      />
      <motion.text
        x="150"
        y="94"
        textAnchor="middle"
        fontSize="9"
        fill="#fff"
        fontWeight="600"
        animate={{ opacity: [1, 0, 1] }}
        transition={loop(4)}
      >
        Tarik / Buang
      </motion.text>

      {/* gelombang stres menjadi tenang */}
      <motion.path
        d="M20 140 Q 40 120 60 140 T 100 140 T 140 140"
        fill="none"
        stroke="#f43f5e"
        strokeWidth="2"
        animate={{
          d: [
            "M20 140 Q 40 120 60 140 T 100 140 T 140 140",
            "M20 140 Q 40 135 60 140 T 100 140 T 140 140",
            "M20 140 Q 40 120 60 140 T 100 140 T 140 140",
          ],
        }}
        transition={loop(4)}
      />
      <path
        d="M160 140 Q 180 135 200 140 T 240 140 T 280 140"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
      />
    </svg>
  );
}

const SCENES = {
  "penyebab-dm": { Scene: PenyebabDMScene, bg: "from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20" },
  "pola-makan-sehat": { Scene: PolaMakanScene, bg: "from-emerald-50 to-lime-50 dark:from-emerald-950/30 dark:to-lime-950/20" },
  "aktivitas-fisik": { Scene: AktivitasFisikScene, bg: "from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/20" },
  "manajemen-stres": { Scene: ManajemenStresScene, bg: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20" },
};

export default function TopicAnimation({ slug }) {
  const config = SCENES[slug];
  if (!config) return null;
  const { Scene, bg } = config;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br ${bg} p-2 aspect-[300/160] overflow-hidden`}
    >
      <Scene />
    </motion.div>
  );
}
