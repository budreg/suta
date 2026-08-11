"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { getMateriList, adminGetAllSoal } from "@/lib/db";

export default function AdminHome() {
  const [totalMateri, setTotalMateri] = useState(0);
  const [totalSoal, setTotalSoal] = useState(0);
  const [totalSoalAktif, setTotalSoalAktif] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [materi, soal] = await Promise.all([getMateriList(), adminGetAllSoal()]);
      setTotalMateri(materi.length);
      setTotalSoal(soal.length);
      setTotalSoalAktif(soal.filter((s) => s.aktif).length);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-slate-400 dark:text-slate-500 text-sm">Memuat...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{totalMateri}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Materi</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-amber-600">{totalSoal}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Total Soal</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-sky-600">{totalSoalAktif}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Soal Aktif</p>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/materi">
          <Card className="hover:shadow-md transition cursor-pointer">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">📚 Kelola Materi</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Tambah, edit, atau hapus materi edukasi.</p>
          </Card>
        </Link>
        <Link href="/admin/kuis">
          <Card className="hover:shadow-md transition cursor-pointer">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">🧠 Kelola Soal Kuis</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Tambah, edit, aktif/nonaktifkan soal.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
