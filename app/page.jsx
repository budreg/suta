"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import CountUp from "@/components/CountUp";
import { useAuth } from "@/lib/AuthContext";
import {
  getMateriList,
  getMateriSelesai,
  getSkorTerbaik,
  getProfile,
  getBadges,
} from "@/lib/db";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [poin, setPoin] = useState(0);
  const [totalMateri, setTotalMateri] = useState(0);
  const [materiSelesai, setMateriSelesai] = useState([]);
  const [skorTerbaik, setSkorTerbaik] = useState(0);
  const [badges, setBadges] = useState([]);
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [materiList, selesai, skor, profile, badgeList] = await Promise.all([
        getMateriList(),
        getMateriSelesai(user.id),
        getSkorTerbaik(user.id),
        getProfile(user.id),
        getBadges(user.id),
      ]);
      setTotalMateri(materiList.length);
      setMateriSelesai(selesai);
      setSkorTerbaik(skor);
      setPoin(profile?.poin_total ?? 0);
      setNama(profile?.nama ?? "");
      setBadges(badgeList);
      setLoading(false);
    })();
  }, [user]);

  const menu = [
    { href: "/materi", title: "Materi Edukasi", desc: "Penyebab DM, pola makan, aktivitas fisik, manajemen stres.", emoji: "📚", color: "bg-emerald-50 text-emerald-700" },
    { href: "/kuis", title: "Kuis Pengetahuan", desc: "Uji pemahamanmu tentang diabetes dan dapatkan poin.", emoji: "🧠", color: "bg-amber-50 text-amber-700" },
    { href: "/tracker", title: "Tracker Harian", desc: "Catat pola makan dan aktivitas fisikmu setiap hari.", emoji: "📝", color: "bg-sky-50 text-sky-700" },
    { href: "/simulasi", title: "Simulasi Risiko", desc: "Lihat dampak gaya hidupmu terhadap risiko diabetes.", emoji: "⚡", color: "bg-rose-50 text-rose-700" },
  ];

  const statCards = [
    { label: "Total Poin", value: poin, suffix: "", color: "text-emerald-600" },
    { label: "Skor Kuis Terbaik", value: skorTerbaik, suffix: "%", color: "text-amber-600" },
    { label: "Materi Selesai", value: materiSelesai.length, suffix: `/${totalMateri}`, color: "text-sky-600" },
    { label: "Badge Diraih", value: badges.length, suffix: "", color: "text-rose-600" },
  ];

  if (authLoading || loading) {
    return <p className="text-center text-slate-400 py-16">Memuat...</p>;
  }

  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Halo, {nama || "Sobat Sehat"}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Belajar, main kuis, catat kebiasaan, dan lihat simulasi dampak gaya hidupmu.
        </p>
      </motion.section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <Card className="text-center">
              <p className={`text-2xl font-bold ${s.color}`}>
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section>
        <h2 className="font-semibold text-slate-700 mb-2">Progress Belajar</h2>
        <Card>
          <ProgressBar value={materiSelesai.length} max={totalMateri} />
        </Card>
      </section>

      <section>
        <h2 className="font-semibold text-slate-700 mb-3">Menu Utama</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {menu.map((m, i) => (
            <motion.div
              key={m.href}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.3 }}
            >
              <Link href={m.href}>
                <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Card className="h-full hover:shadow-md transition cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`text-2xl rounded-xl w-11 h-11 flex items-center justify-center ${m.color}`}>
                        {m.emoji}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{m.title}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{m.desc}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
