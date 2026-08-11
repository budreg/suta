"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SoalForm from "@/components/admin/SoalForm";
import { adminGetSoalById } from "@/lib/db";

export default function SoalEdit() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetSoalById(params.id).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <p className="text-slate-400 dark:text-slate-500 text-sm">Memuat...</p>;
  if (!data) return <p className="text-slate-400 dark:text-slate-500 text-sm">Soal tidak ditemukan.</p>;

  return (
    <div>
      <h2 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Edit Soal</h2>
      <SoalForm initialData={data} soalId={params.id} />
    </div>
  );
}
