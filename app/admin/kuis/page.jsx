"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { adminGetAllSoal, adminDeleteSoal, adminToggleSoalAktif } from "@/lib/db";

export default function AdminKuisList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function muat() {
    const data = await adminGetAllSoal();
    setList(data);
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function hapus(id) {
    if (!confirm("Hapus soal ini? Tindakan ini tidak bisa dibatalkan.")) return;
    await adminDeleteSoal(id);
    muat();
  }

  async function toggleAktif(id, aktifSaatIni) {
    await adminToggleSoalAktif(id, !aktifSaatIni);
    muat();
  }

  if (loading) return <p className="text-slate-400 text-sm">Memuat...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">
          {list.filter((s) => s.aktif).length} aktif dari {list.length} soal
        </p>
        <Link
          href="/admin/kuis/baru"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          + Tambah Soal
        </Link>
      </div>

      <div className="space-y-2">
        {list.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Belum ada soal.</p>
        )}
        {list.map((s) => (
          <Card key={s.id} className={!s.aktif ? "opacity-50" : ""}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-slate-800">{s.pertanyaan}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Jawaban benar: {s.pilihan[s.jawaban_benar]}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => toggleAktif(s.id, s.aktif)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-lg ${
                    s.aktif
                      ? "text-slate-500 hover:bg-slate-100"
                      : "text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {s.aktif ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <Link
                  href={`/admin/kuis/edit/${s.id}`}
                  className="text-xs text-sky-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-sky-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => hapus(s.id)}
                  className="text-xs text-rose-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
                >
                  Hapus
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
