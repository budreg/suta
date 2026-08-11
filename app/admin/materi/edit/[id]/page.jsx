"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MateriForm from "@/components/admin/MateriForm";
import { adminGetMateriById } from "@/lib/db";

export default function MateriEdit() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetMateriById(params.id).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <p className="text-slate-400 text-sm">Memuat...</p>;
  if (!data) return <p className="text-slate-400 text-sm">Materi tidak ditemukan.</p>;

  return (
    <div>
      <h2 className="font-semibold text-slate-700 mb-4">Edit Materi</h2>
      <MateriForm initialData={data} materiId={params.id} />
    </div>
  );
}
