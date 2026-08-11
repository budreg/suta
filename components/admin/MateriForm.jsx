"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { adminCreateMateri, adminUpdateMateri, uploadInfografis } from "@/lib/db";

const kategoriOptions = [
  "Penyebab",
  "Gejala",
  "Nutrisi",
  "Aktivitas",
  "Kesehatan Mental",
  "Pencegahan",
];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function MateriForm({ initialData, materiId }) {
  const router = useRouter();
  const isEdit = Boolean(materiId);

  const [form, setForm] = useState({
    judul: initialData?.judul || "",
    slug: initialData?.slug || "",
    kategori: initialData?.kategori || kategoriOptions[0],
    ringkasan: initialData?.ringkasan || "",
    konten: initialData?.konten?.join("\n\n") || "",
    video_url: initialData?.video_url || "",
    infografis_url: initialData?.infografis_url || "",
    urutan: initialData?.urutan ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUploadInfografis(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!form.slug) {
      setError("Isi judul dulu (biar slug terbentuk) sebelum upload gambar.");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const url = await uploadInfografis(file, form.slug);
      setForm((f) => ({ ...f, infografis_url: url }));
    } catch (err) {
      setError(err.message || "Gagal upload gambar.");
    } finally {
      setUploading(false);
    }
  }

  function updateJudul(judul) {
    setForm((f) => ({
      ...f,
      judul,
      slug: isEdit ? f.slug : slugify(judul),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      judul: form.judul,
      slug: form.slug,
      kategori: form.kategori,
      ringkasan: form.ringkasan,
      konten: form.konten.split("\n\n").map((p) => p.trim()).filter(Boolean),
      video_url: form.video_url || null,
      infografis_url: form.infografis_url || null,
      urutan: Number(form.urutan) || 0,
    };

    try {
      if (isEdit) {
        await adminUpdateMateri(materiId, payload);
      } else {
        await adminCreateMateri(payload);
      }
      router.push("/admin/materi");
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
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Judul</label>
          <input
            required
            value={form.judul}
            onChange={(e) => updateJudul(e.target.value)}
            className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
            placeholder="Contoh: Pola Makan Sehat untuk Remaja"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Slug (URL) {isEdit && <span className="text-xs text-slate-400 dark:text-slate-500">— tidak bisa diubah</span>}
          </label>
          <input
            required
            disabled={isEdit}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 disabled:bg-slate-50 dark:bg-slate-800 disabled:text-slate-400 dark:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Kategori</label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
            >
              {kategoriOptions.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Urutan Tampil</label>
            <input
              type="number"
              value={form.urutan}
              onChange={(e) => setForm({ ...form, urutan: e.target.value })}
              className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Ringkasan Singkat</label>
          <input
            required
            value={form.ringkasan}
            onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
            className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
            placeholder="Muncul di daftar materi, 1 kalimat"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Isi Materi <span className="text-xs text-slate-400 dark:text-slate-500">— pisahkan tiap paragraf dengan baris kosong</span>
          </label>
          <textarea
            required
            rows={8}
            value={form.konten}
            onChange={(e) => setForm({ ...form, konten: e.target.value })}
            className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-normal"
            placeholder={"Paragraf pertama...\n\nParagraf kedua..."}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Link Video YouTube <span className="text-xs text-slate-400 dark:text-slate-500">(opsional)</span>
          </label>
          <input
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            className="w-full mt-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Infografis <span className="text-xs text-slate-400 dark:text-slate-500">(opsional, format JPG/PNG, maks ±5MB)</span>
          </label>

          {form.infografis_url && (
            <div className="mt-2 relative w-full max-w-xs">
              <img
                src={form.infografis_url}
                alt="Infografis"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, infografis_url: "" })}
                className="absolute top-2 right-2 bg-white/90 dark:bg-slate-700/90 text-rose-600 text-xs font-medium px-2 py-1 rounded-lg shadow hover:bg-white dark:hover:bg-slate-700"
              >
                Hapus Gambar
              </button>
            </div>
          )}

          <div className="mt-2">
            <label className="inline-block cursor-pointer">
              <span
                className={`inline-block px-4 py-2 rounded-lg text-sm font-medium border ${
                  uploading
                    ? "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                    : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {uploading ? "Mengupload..." : form.infografis_url ? "Ganti Gambar" : "Upload Gambar"}
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleUploadInfografis}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </Card>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex gap-3">
        <button
          disabled={saving}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Materi"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/materi")}
          className="px-5 py-2.5 rounded-xl font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:bg-slate-700"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
