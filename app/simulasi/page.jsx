"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/Card";
import CountUp from "@/components/CountUp";

const defaultForm = {
  polaMakan: "sehat", // sehat, cukup, buruk
  aktivitas: 3, // hari/minggu
  tidur: 7, // jam/hari
  stres: "rendah", // rendah, sedang, tinggi
  bmi: "normal", // normal, berlebih, obesitas
  riwayatKeluarga: "tidak", // ya, tidak
};

const bobot = {
  polaMakan: { sehat: 0, cukup: 12, buruk: 25 },
  stres: { rendah: 0, sedang: 8, tinggi: 15 },
  bmi: { normal: 0, berlebih: 15, obesitas: 25 },
  riwayatKeluarga: { tidak: 0, ya: 15 },
};

function hitungSkorAktivitas(hariPerMinggu) {
  // makin sering aktivitas, makin rendah kontribusi risiko
  if (hariPerMinggu >= 5) return 0;
  if (hariPerMinggu >= 3) return 5;
  if (hariPerMinggu >= 1) return 12;
  return 20;
}

function hitungSkorTidur(jam) {
  if (jam >= 7 && jam <= 8) return 0;
  if (jam >= 6) return 5;
  return 10;
}

export default function SimulasiPage() {
  const [form, setForm] = useState(defaultForm);

  const hasil = useMemo(() => {
    let skor = 0;
    skor += bobot.polaMakan[form.polaMakan];
    skor += bobot.stres[form.stres];
    skor += bobot.bmi[form.bmi];
    skor += bobot.riwayatKeluarga[form.riwayatKeluarga];
    skor += hitungSkorAktivitas(Number(form.aktivitas));
    skor += hitungSkorTidur(Number(form.tidur));

    const skorMaks = 25 + 15 + 25 + 15 + 20 + 10; // 110
    const persen = Math.round((skor / skorMaks) * 100);

    let level = "Rendah";
    let warna = "text-emerald-600";
    let bg = "bg-emerald-500";
    if (persen >= 60) {
      level = "Tinggi";
      warna = "text-rose-600";
      bg = "bg-rose-500";
    } else if (persen >= 30) {
      level = "Sedang";
      warna = "text-amber-600";
      bg = "bg-amber-500";
    }

    return { persen, level, warna, bg };
  }, [form]);

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Simulasi Dampak Gaya Hidup</h1>
        <p className="text-slate-500 mt-1">
          Isi kondisi gaya hidupmu untuk melihat perkiraan tingkat risiko diabetes.
          <span className="block text-xs text-slate-400 mt-1">
            *Ini simulasi edukatif, bukan diagnosis medis. Konsultasikan ke dokter untuk penilaian sebenarnya.
          </span>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Pola Makan</label>
            <select
              value={form.polaMakan}
              onChange={(e) => update("polaMakan", e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
            >
              <option value="sehat">Sehat (banyak sayur, rendah gula)</option>
              <option value="cukup">Cukup (kadang tinggi gula/lemak)</option>
              <option value="buruk">Buruk (sering makanan cepat saji/manis)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Aktivitas Fisik: {form.aktivitas} hari/minggu
            </label>
            <input
              type="range"
              min="0"
              max="7"
              value={form.aktivitas}
              onChange={(e) => update("aktivitas", e.target.value)}
              className="w-full mt-2 accent-emerald-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Rata-rata Tidur: {form.tidur} jam/hari
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={form.tidur}
              onChange={(e) => update("tidur", e.target.value)}
              className="w-full mt-2 accent-emerald-600"
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Tingkat Stres</label>
            <select
              value={form.stres}
              onChange={(e) => update("stres", e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
            >
              <option value="rendah">Rendah</option>
              <option value="sedang">Sedang</option>
              <option value="tinggi">Tinggi</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Kategori Berat Badan (BMI)</label>
            <select
              value={form.bmi}
              onChange={(e) => update("bmi", e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
            >
              <option value="normal">Normal</option>
              <option value="berlebih">Berlebih</option>
              <option value="obesitas">Obesitas</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Riwayat Keluarga Diabetes</label>
            <select
              value={form.riwayatKeluarga}
              onChange={(e) => update("riwayatKeluarga", e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
            >
              <option value="tidak">Tidak Ada</option>
              <option value="ya">Ada</option>
            </select>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-slate-700 mb-3">Estimasi Tingkat Risiko</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                animate={{ strokeDasharray: `${hasil.persen}, 100` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={hasil.warna}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-slate-700">
                <CountUp value={hasil.persen} suffix="%" />
              </span>
            </div>
          </div>
          <div>
            <motion.p
              key={hasil.level}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={`text-lg font-bold ${hasil.warna}`}
            >
              Risiko {hasil.level}
            </motion.p>
            <p className="text-sm text-slate-500 mt-1">
              {hasil.level === "Rendah" &&
                "Pertahankan pola hidup sehatmu! Terus jaga makan, olahraga, dan istirahat cukup."}
              {hasil.level === "Sedang" &&
                "Ada beberapa kebiasaan yang bisa diperbaiki. Coba mulai dari tambah aktivitas fisik atau kurangi gula."}
              {hasil.level === "Tinggi" &&
                "Sebaiknya mulai ubah kebiasaan secara bertahap dan konsultasikan ke tenaga medis untuk pemeriksaan lebih lanjut."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
