"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/Card";
import Confetti from "@/components/Confetti";
import { useAuth } from "@/lib/AuthContext";
import { getMateriBySlug, getMateriSelesai, tandaiMateriSelesai } from "@/lib/db";
import { getYoutubeThumbnail, getYoutubeWatchUrl } from "@/lib/youtube";

export default function MateriDetail() {
  const params = useParams();
  const { user } = useAuth();
  const [materi, setMateri] = useState(null);
  const [selesai, setSelesai] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [m, list] = await Promise.all([
        getMateriBySlug(params.slug),
        getMateriSelesai(user.id),
      ]);
      setMateri(m);
      setSelesai(list.includes(params.slug));
      setLoading(false);
    })();
  }, [user, params.slug]);

  if (loading) return <p className="text-center text-slate-400 py-16">Memuat...</p>;

  if (!materi) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Materi tidak ditemukan.</p>
        <Link href="/materi" className="text-emerald-600 font-medium">
          ← Kembali ke daftar materi
        </Link>
      </div>
    );
  }

  async function tandaiSelesai() {
    if (selesai) return;
    await tandaiMateriSelesai(user.id, materi.slug);
    setSelesai(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1300);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/materi" className="text-sm text-emerald-600 font-medium">
        ← Kembali ke daftar materi
      </Link>

      <div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          {materi.kategori}
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">{materi.judul}</h1>
      </div>

      {materi.video_url && (
        <Card>
          <a
            href={getYoutubeWatchUrl(materi.video_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-video w-full rounded-lg overflow-hidden bg-slate-900"
          >
            {getYoutubeThumbnail(materi.video_url) ? (
              <img
                src={getYoutubeThumbnail(materi.video_url)}
                alt={materi.judul}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition"
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition">
                <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-rose-600 ml-1" />
              </div>
            </div>
            <span className="absolute bottom-3 left-3 text-xs text-white/90 bg-black/50 px-2 py-1 rounded">
              Tonton di YouTube ↗
            </span>
          </a>
        </Card>
      )}

      {materi.infografis_url && (
        <Card>
          <img
            src={materi.infografis_url}
            alt={`Infografis ${materi.judul}`}
            className="w-full rounded-lg"
          />
        </Card>
      )}

      <Card>
        <div className="space-y-3">
          {(materi.konten || []).map((p, i) => (
            <p key={i} className="text-slate-600 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </Card>

      <div className="relative inline-block w-full sm:w-auto">
        {showConfetti && <Confetti count={18} />}
        <motion.button
          onClick={tandaiSelesai}
          disabled={selesai}
          whileHover={!selesai ? { scale: 1.03 } : {}}
          whileTap={!selesai ? { scale: 0.96 } : {}}
          animate={showConfetti ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.35 }}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium transition ${
            selesai
              ? "bg-emerald-100 text-emerald-700 cursor-default"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={selesai ? "done" : "todo"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selesai ? "✓ Sudah selesai dipelajari (+10 poin)" : "Tandai Selesai (+10 poin)"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
