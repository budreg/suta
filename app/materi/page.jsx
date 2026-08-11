"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { useAuth } from "@/lib/AuthContext";
import { getMateriList, getMateriSelesai } from "@/lib/db";

export default function MateriPage() {
  const { user } = useAuth();
  const [materiList, setMateriList] = useState([]);
  const [selesai, setSelesai] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [list, done] = await Promise.all([
        getMateriList(),
        getMateriSelesai(user.id),
      ]);
      setMateriList(list);
      setSelesai(done);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <p className="text-center text-slate-400 dark:text-slate-500 py-16">Memuat...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Materi Edukasi</h1>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
          Pelajari dasar-dasar diabetes melitus dengan bahasa sederhana.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {materiList.map((m) => {
          const done = selesai.includes(m.slug);
          return (
            <Link key={m.slug} href={`/materi/${m.slug}`}>
              <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer relative">
                {done && (
                  <span className="absolute top-3 right-3 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    ✓ Selesai
                  </span>
                )}
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {m.kategori}
                </span>
                {m.infografis_url && (
                  <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full ml-1">
                    🖼️ Infografis
                  </span>
                )}
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mt-2">{m.judul}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">{m.ringkasan}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
