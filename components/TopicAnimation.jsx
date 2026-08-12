"use client";
import { motion } from "framer-motion";

/**
 * Animasi 2D edukatif berbasis SVG + framer-motion (Versi Pro & Immersive).
 * Dioptimalkan dengan transisi mulus, visual berdinding kaca, dan detail biologis akurat.
 */

const loop = (duration, extra = {}) => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut",
  ...extra,
});

/* ---------- 1. Penyebab DM: Resistensi Insulin & Penumpukan Glukosa ---------- */
function PenyebabDMScene() {
  const glucoseParticles = Array.from({ length: 7 }, (_, i) => i);

  return (
    <svg viewBox="0 0 320 180" className="w-full h-full drop-shadow-sm">
      {/* Background Pembuluh Darah */}
      <defs>
        <linearGradient id="bloodStream" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fee2e2" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#fecaca" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fee2e2" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect x="10" y="20" width="300" height="65" rx="16" fill="url(#bloodStream)" stroke="#fca5a5" strokeWidth="1.5" />
      <text x="25" y="42" fontSize="10" fill="#991b1b" fontWeight="700" letterSpacing="0.3">
        ALIRAN DARAH (Glukosa Tinggi)
      </text>

      {/* Partikel Glukosa Mengambang & Menumpuk */}
      {glucoseParticles.map((i) => (
        <motion.g
          key={i}
          initial={{ x: 25 + i * 32, y: 55 }}
          animate={{
            x: [25 + i * 32, 170 + (i % 2) * 15, 150, 175 + (i % 3) * 10],
            y: [55, 55, 95, 45],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={loop(3.5 + i * 0.15, { delay: i * 0.15 })}
        >
          <circle cx="0" cy="0" r="7" fill="#f59e0b" filter="url(#glow)" />
          <text x="0" y="3.5" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">G</text>
        </motion.g>
      ))}

      {/* Membran Sel Target & Reseptor Terkunci */}
      <path d="M 40 110 Q 160 95 280 110 L 280 170 L 40 170 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" rx="10" />
      <text x="160" y="130" fontSize="10" fill="#475569" fontWeight="700" textAnchor="middle">
        JARINGAN SEL TUBUH
      </text>

      {/* Reseptor Insulin Rusak / Terkunci */}
      <g transform="translate(160, 105)">
        <motion.rect
          x="-14"
          y="-12"
          width="28"
          height="16"
          rx="5"
          fill="#dc2626"
          animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.05, 1] }}
          transition={loop(1.8)}
          style={{ transformOrigin: "center" }}
        />
        <text x="0" y="-2" fontSize="8" fill="#fff" fontWeight="bold" textAnchor="middle">X</text>
      </g>
      
      <text x="160" y="152" fontSize="9" fill="#b91c1c" fontWeight="600" textAnchor="middle">
        Reseptor Insulin Resisten (Terkunci)
      </text>
    </svg>
  );
}

/* ---------- 2. Pola Makan Sehat: Visual Porsi "Isi Piringku" Dinamis ---------- */
function PolaMakanScene() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full drop-shadow-sm">
      {/* Bayangan Piring */}
      <ellipse cx="160" cy="100" rx="72" ry="68" fill="#e2e8f0" />
      <circle cx="160" cy="100" r="64" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />

      {/* Segmentasi Makanan dengan Animasi Masuk */}
      {/* 1. Sayur & Buah (Setengah Piring Kiri - 50%) */}
      <motion.path
        d="M160 100 L160 36 A64 64 0 0 0 160 164 Z"
        fill="#22c55e"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.9 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        style={{ transformOrigin: "160px 100px" }}
      />
      
      {/* 2. Karbohidrat Kompleks (Seperempat Kanan Atas - 25%) */}
      <motion.path
        d="M160 100 L160 36 A64 64 0 0 1 224 100 Z"
        fill="#f59e0b"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.95 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
        style={{ transformOrigin: "160px 100px" }}
      />

      {/* 3. Protein Sehat (Seperempat Kanan Bawah - 25%) */}
      <motion.path
        d="M160 100 L224 100 A64 64 0 0 1 160 164 Z"
        fill="#ef4444"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.95 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "backOut" }}
        style={{ transformOrigin: "160px 100px" }}
      />

      {/* Garis Pemisah Piring */}
      <line x1="160" y1="36" x2="160" y2="164" stroke="#ffffff" strokeWidth="2.5" />
      <line x1="160" y1="100" x2="224" y2="100" stroke="#ffffff" strokeWidth="2.5" />

      {/* Label Keterangan Interaktif */}
      <motion.g animate={{ y: [0, -3, 0] }} transition={loop(3)}>
        <rect x="14" y="20" width="76" height="22" rx="6" fill="#15803d" />
        <text x="52" y="34" fontSize="9" fill="#fff" fontWeight="700" textAnchor="middle">50% Sayur & Buah</text>
      </motion.g>

      <motion.g animate={{ y: [0, -3, 0] }} transition={loop(3, { delay: 0.5 })}>
        <rect x="232" y="65" width="74" height="22" rx="6" fill="#b45309" />
        <text x="269" y="79" fontSize="9" fill="#fff" fontWeight="700" textAnchor="middle">25% Karbohidrat</text>
      </motion.g>

      <motion.g animate={{ y: [0, -3, 0] }} transition={loop(3, { delay: 1 })}>
        <rect x="232" y="115" width="74" height="22" rx="6" fill="#991b1b" />
        <text x="269" y="129" fontSize="9" fill="#fff" fontWeight="700" textAnchor="middle">25% Protein</text>
      </motion.g>
    </svg>
  );
}

/* ---------- 3. Aktivitas Fisik: Konversi Energi & Penurunan Gula Darah ---------- */
function AktivitasFisikScene() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full drop-shadow-sm">
      {/* Lintasan Lari & Efek Gerak */}
      <line x1="20" y1="135" x2="300" y2="135" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      
      {/* Animasi Figur Berlari Ergonomis */}
      <motion.g animate={{ x: [0, 110, 0] }} transition={loop(4.5)}>
        <g transform="translate(60, 75)">
          {/* Kepala */}
          <circle cx="20" cy="15" r="7" fill="#0284c7" />
          {/* Badan */}
          <line x1="20" y1="22" x2="20" y2="45" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          {/* Tangan Bergerak */}
          <motion.line 
            x1="20" y1="28" x2="8" y2="40" 
            stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round"
            animate={{ rotate: [-25, 25, -25] }}
            transition={loop(0.55)}
            style={{ transformOrigin: "20px 28px" }}
          />
          {/* Kaki Berlari */}
          <motion.line 
            x1="20" y1="45" x2="10" y2="62" 
            stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round"
            animate={{ rotate: [-30, 30, -30] }}
            transition={loop(0.55)}
            style={{ transformOrigin: "20px 45px" }}
          />
        </g>
      </motion.g>

      {/* Indikator Penurunan Gula Darah Real-time */}
      <g transform="translate(170, 30)">
        <rect x="0" y="0" width="125" height="42" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x="12" y="16" fontSize="8.5" fill="#0369a1" fontWeight="700">Kadar Gula Darah</text>
        
        {/* Bar Grafik Menurun */}
        <rect x="12" y="24" width="100" height="8" rx="4" fill="#e2e8f0" />
        <motion.rect
          x="12"
          y="24"
          height="8"
          rx="4"
          fill="#0ea5e9"
          initial={{ width: 100 }}
          animate={{ width: [100, 35, 100] }}
          transition={loop(4.5)}
        />
      </g>

      <text x="160" y="162" fontSize="9.5" fill="#334155" fontWeight="600" textAnchor="middle">
        Olahraga membantu otot membakar glukosa tanpa insulin berlebih
      </text>
    </svg>
  );
}

/* ---------- 4. Manajemen Stres: Sinkronisasi Pernapasan & Ketenangan Gelombang ---------- */
function ManajemenStresScene() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full drop-shadow-sm">
      {/* Lingkaran Pernapasan Utama (Inhale / Exhale) */}
      <motion.circle
        cx="160"
        cy="85"
        r="38"
        fill="#8b5cf6"
        opacity="0.25"
        animate={{ r: [30, 55, 30], opacity: [0.2, 0.45, 0.2] }}
        transition={loop(5)}
      />
      <motion.circle
        cx="160"
        cy="85"
        r="24"
        fill="#7c3aed"
        animate={{ r: [20, 38, 20] }}
        transition={loop(5)}
      />
      <motion.text
        x="160"
        y="89"
        textAnchor="middle"
        fontSize="10"
        fill="#fff"
        fontWeight="700"
        animate={{ scale: [1, 1.08, 1] }}
        transition={loop(5)}
      >
        Napas
      </motion.text>

      {/* Transisi Gelombang Stres (Merah) ke Tenang (Hijau) */}
      <g transform="translate(0, 130)">
        <text x="160" y="-8" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="600">
          Stabilisasi Sistem Saraf & Penurunan Kortisol
        </text>
        
        {/* Gelombang Stres */}
        <motion.path
          d="M 20 15 Q 40 5 60 15 T 100 15 T 140 15"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={{
            d: [
              "M 20 15 Q 35 2 50 15 T 80 15 T 110 15",
              "M 20 15 Q 35 22 50 15 T 80 15 T 110 15",
              "M 20 15 Q 35 2 50 15 T 80 15 T 110 15"
            ]
          }}
          transition={loop(3)}
        />
        
        {/* Titik Transisi / Panah */}
        <line x1="148" y1="5" x2="172" y2="5" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

        {/* Gelombang Tenang */}
        <path
          d="M 180 15 Q 210 12 240 15 T 300 15"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

const SCENES = {
  "penyebab-dm": { Scene: PenyebabDMScene, bg: "from-rose-50/80 to-orange-50/80 dark:from-rose-950/30 dark:to-orange-950/20" },
  "pola-makan-sehat": { Scene: PolaMakanScene, bg: "from-emerald-50/80 to-lime-50/80 dark:from-emerald-950/30 dark:to-lime-950/20" },
  "aktivitas-fisik": { Scene: AktivitasFisikScene, bg: "from-sky-50/80 to-cyan-50/80 dark:from-sky-950/30 dark:to-cyan-950/20" },
  "manajemen-stres": { Scene: ManajemenStresScene, bg: "from-violet-50/80 to-purple-50/80 dark:from-violet-950/30 dark:to-purple-950/20" },
};

export default function TopicAnimation({ slug }) {
  const config = SCENES[slug];
  if (!config) return null;
  const { Scene, bg } = config;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-gradient-to-br ${bg} p-3 aspect-[320/180] overflow-hidden shadow-inner flex items-center justify-center`}
    >
      <Scene />
    </motion.div>
  );
}