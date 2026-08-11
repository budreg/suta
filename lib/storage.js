// Helper sederhana untuk baca/tulis data ke localStorage.
// Nanti kalau mau pindah ke backend beneran (Supabase/Firebase),
// cukup ganti isi fungsi-fungsi ini tanpa ubah kode di halaman.

const isBrowser = typeof window !== "undefined";

export function getData(key, fallback) {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function setData(key, value) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // storage penuh / diblokir, abaikan
  }
}

export const KEYS = {
  TRACKER_MAKAN: "de_tracker_makan",
  TRACKER_AKTIVITAS: "de_tracker_aktivitas",
  KUIS_SKOR: "de_kuis_skor_terbaik",
  KUIS_RIWAYAT: "de_kuis_riwayat",
  MATERI_SELESAI: "de_materi_selesai",
  POIN: "de_poin_total",
  BADGES: "de_badges",
};

export function tambahPoin(jumlah) {
  const total = getData(KEYS.POIN, 0);
  setData(KEYS.POIN, total + jumlah);
  return total + jumlah;
}
