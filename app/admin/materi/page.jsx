"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { getMateriList, adminDeleteMateri } from "@/lib/db";

export default function AdminMateriList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function muat() {
    const data = await getMateriList();
    setList(data);
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function hapus(id, judul) {
    if (!confirm(`Hapus materi "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    await adminDeleteMateri(id);
    muat();
  }

  if (loading) return <p className="text-slate-400 text-sm">Memuat...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin/materi/baru"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          + Tambah Materi
        </Link>
      </div>

      <div className="space-y-2">
        {list.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Belum ada materi.</p>
        )}
        {list.map((m) => (
          <Card key={m.id} className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {m.kategori}
              </span>
              <h3 className="font-semibold text-slate-800 mt-1">{m.judul}</h3>
              <p className="text-xs text-slate-400 mt-0.5">slug: {m.slug}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/admin/materi/edit/${m.id}`}
                className="text-sm text-sky-600 font-medium px-3 py-1.5 rounded-lg hover:bg-sky-50"
              >
                Edit
              </Link>
              <button
                onClick={() => hapus(m.id, m.judul)}
                className="text-sm text-rose-600 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50"
              >
                Hapus
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
