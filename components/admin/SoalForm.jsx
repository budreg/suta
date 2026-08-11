"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { adminCreateSoal, adminUpdateSoal } from "@/lib/db";

export default function SoalForm({ initialData, soalId }) {
  const router = useRouter();
  const isEdit = Boolean(soalId);

  const [form, setForm] = useState({
    pertanyaan: initialData?.pertanyaan || "",
    pilihan: initialData?.pilihan || ["", "", "", ""],
    jawaban_benar: initialData?.jawaban_benar ?? 0,
    penjelasan: initialData?.penjelasan || "",
    aktif: initialData?.aktif ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updatePilihan(idx, value) {
    const pilihan = [...form.pilihan];
    pilihan[idx] = value;
    setForm({ ...form, pilihan });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.pilihan.some((p) => !p.trim())) {
      setError("Semua 4 pilihan jawaban harus diisi.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdateSoal(soalId, form);
      } else {
        await adminCreateSoal(form);
      }
      router.push("/admin/kuis");
      router.refresh();
    } catch (err) {
      setError(err.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <Card className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600">Pertanyaan</label>
          <textarea
            required
            rows={2}
            value={form.pertanyaan}
            onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })}
            className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
            placeholder="Tulis pertanyaan kuis di sini..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">Pilihan Jawaban</label>
          <p className="text-xs text-slate-400 mb-2">Klik radio button di sebelah pilihan yang benar.</p>
          <div className="space-y-2">
            {form.pilihan.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="jawaban_benar"
                  checked={form.jawaban_benar === idx}
                  onChange={() => setForm({ ...form, jawaban_benar: idx })}
                  className="accent-emerald-600"
                />
                <input
                  required
                  value={p}
                  onChange={(e) => updatePilihan(idx, e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2"
                  placeholder={`Pilihan ${idx + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">
            Penjelasan Jawaban <span className="text-xs text-slate-400">(muncul setelah user menjawab)</span>
          </label>
          <textarea
            rows={2}
            value={form.penjelasan}
            onChange={(e) => setForm({ ...form, penjelasan: e.target.value })}
            className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.aktif}
            onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
            className="accent-emerald-600"
          />
          Tampilkan soal ini di kuis
        </label>
      </Card>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex gap-3">
        <button
          disabled={saving}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Soal"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/kuis")}
          className="px-5 py-2.5 rounded-xl font-medium text-slate-500 hover:bg-slate-100"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
