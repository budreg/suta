"use client";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { useAuth } from "@/lib/AuthContext";
import {
  getTrackerMakan,
  tambahTrackerMakan,
  hapusTrackerMakan,
  getTrackerAktivitas,
  tambahTrackerAktivitas,
  hapusTrackerAktivitas,
} from "@/lib/db";

const jenisMakanan = ["Sarapan", "Makan Siang", "Makan Malam", "Camilan"];
const jenisAktivitas = ["Jalan Kaki", "Lari", "Bersepeda", "Senam/Olahraga", "Angkat Beban"];

export default function TrackerPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("makan");
  const [makanList, setMakanList] = useState([]);
  const [aktivitasList, setAktivitasList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formMakan, setFormMakan] = useState({ jenis: jenisMakanan[0], deskripsi: "" });
  const [formAktivitas, setFormAktivitas] = useState({ jenis: jenisAktivitas[0], durasi: "" });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [makan, aktivitas] = await Promise.all([
        getTrackerMakan(user.id),
        getTrackerAktivitas(user.id),
      ]);
      setMakanList(makan);
      setAktivitasList(aktivitas);
      setLoading(false);
    })();
  }, [user]);

  async function tambahMakan(e) {
    e.preventDefault();
    if (!formMakan.deskripsi.trim()) return;
    await tambahTrackerMakan(user.id, formMakan);
    const updated = await getTrackerMakan(user.id);
    setMakanList(updated);
    setFormMakan({ jenis: jenisMakanan[0], deskripsi: "" });
  }

  async function tambahAktivitas(e) {
    e.preventDefault();
    if (!formAktivitas.durasi) return;
    await tambahTrackerAktivitas(user.id, {
      jenis: formAktivitas.jenis,
      durasiMenit: Number(formAktivitas.durasi),
    });
    const updated = await getTrackerAktivitas(user.id);
    setAktivitasList(updated);
    setFormAktivitas({ jenis: jenisAktivitas[0], durasi: "" });
  }

  async function hapusMakan(id) {
    await hapusTrackerMakan(id);
    setMakanList(makanList.filter((m) => m.id !== id));
  }

  async function hapusAktivitas(id) {
    await hapusTrackerAktivitas(id);
    setAktivitasList(aktivitasList.filter((a) => a.id !== id));
  }

  if (loading) return <p className="text-center text-slate-400 py-16">Memuat...</p>;

  const totalMenit = aktivitasList.reduce((sum, a) => sum + (a.durasi_menit || 0), 0);

  function formatTanggal(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID") + ", " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tracker Harian</h1>
        <p className="text-slate-500 mt-1">Catat pola makan dan aktivitas fisikmu setiap hari.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-xl font-bold text-sky-600">{makanList.length}</p>
          <p className="text-xs text-slate-500">Entri Makan</p>
        </Card>
        <Card className="text-center">
          <p className="text-xl font-bold text-emerald-600">{totalMenit} mnt</p>
          <p className="text-xs text-slate-500">Total Aktivitas</p>
        </Card>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("makan")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "makan" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          🍽️ Pola Makan
        </button>
        <button
          onClick={() => setTab("aktivitas")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "aktivitas" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          🏃 Aktivitas Fisik
        </button>
      </div>

      {tab === "makan" && (
        <>
          <Card>
            <form onSubmit={tambahMakan} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600">Jenis</label>
                <select
                  value={formMakan.jenis}
                  onChange={(e) => setFormMakan({ ...formMakan, jenis: e.target.value })}
                  className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
                >
                  {jenisMakanan.map((j) => <option key={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Apa yang kamu makan?</label>
                <input
                  value={formMakan.deskripsi}
                  onChange={(e) => setFormMakan({ ...formMakan, deskripsi: e.target.value })}
                  placeholder="Contoh: Nasi merah, ayam bakar, sayur bayam"
                  className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>
              <button className="w-full bg-sky-600 text-white py-2.5 rounded-lg font-medium hover:bg-sky-700">
                + Tambah Catatan (+2 poin)
              </button>
            </form>
          </Card>

          <div className="space-y-2">
            {makanList.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada catatan makan.</p>
            )}
            {makanList.map((m) => (
              <Card key={m.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{m.jenis} — {m.deskripsi}</p>
                  <p className="text-xs text-slate-400">{formatTanggal(m.created_at)}</p>
                </div>
                <button onClick={() => hapusMakan(m.id)} className="text-slate-300 hover:text-rose-500 text-sm">✕</button>
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === "aktivitas" && (
        <>
          <Card>
            <form onSubmit={tambahAktivitas} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600">Jenis Aktivitas</label>
                <select
                  value={formAktivitas.jenis}
                  onChange={(e) => setFormAktivitas({ ...formAktivitas, jenis: e.target.value })}
                  className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
                >
                  {jenisAktivitas.map((j) => <option key={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Durasi (menit)</label>
                <input
                  type="number"
                  min="1"
                  value={formAktivitas.durasi}
                  onChange={(e) => setFormAktivitas({ ...formAktivitas, durasi: e.target.value })}
                  placeholder="Contoh: 30"
                  className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>
              <button className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700">
                + Tambah Catatan (+3 poin)
              </button>
            </form>
          </Card>

          <div className="space-y-2">
            {aktivitasList.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada catatan aktivitas.</p>
            )}
            {aktivitasList.map((a) => (
              <Card key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{a.jenis} — {a.durasi_menit} menit</p>
                  <p className="text-xs text-slate-400">{formatTanggal(a.created_at)}</p>
                </div>
                <button onClick={() => hapusAktivitas(a.id)} className="text-slate-300 hover:text-rose-500 text-sm">✕</button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
