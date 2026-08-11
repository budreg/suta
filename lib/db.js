import { createClient } from "@/lib/supabase/client";

// ================== MATERI ==================

export async function getMateriList() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("materi")
    .select("*")
    .order("urutan", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getMateriBySlug(slug) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("materi")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getMateriSelesai(userId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("materi_progress")
    .select("materi_slug")
    .eq("user_id", userId);
  if (error) throw error;
  return data.map((d) => d.materi_slug);
}

export async function tandaiMateriSelesai(userId, slug) {
  const supabase = createClient();
  const { error } = await supabase
    .from("materi_progress")
    .insert({ user_id: userId, materi_slug: slug });
  if (error && error.code !== "23505") throw error; // 23505 = sudah ada (unique constraint)
  if (!error) await tambahPoin(userId, 10);
}

// ================== KUIS ==================

export async function getSoalKuis() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("soal_kuis")
    .select("*")
    .eq("aktif", true);
  if (error) throw error;
  return data;
}

export async function simpanHasilKuis(userId, { jumlahBenar, jumlahSoal }) {
  const supabase = createClient();
  const persen = Math.round((jumlahBenar / jumlahSoal) * 100);
  const { error } = await supabase.from("kuis_riwayat").insert({
    user_id: userId,
    skor_persen: persen,
    jumlah_benar: jumlahBenar,
    jumlah_soal: jumlahSoal,
  });
  if (error) throw error;
  await tambahPoin(userId, jumlahBenar * 5);
  if (persen === 100) await tambahBadge(userId, "quiz_master");
  return persen;
}

export async function getSkorTerbaik(userId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("kuis_riwayat")
    .select("skor_persen")
    .eq("user_id", userId)
    .order("skor_persen", { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0]?.skor_persen ?? 0;
}

// ================== TRACKER ==================

export async function getTrackerMakan(userId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tracker_makan")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function tambahTrackerMakan(userId, { jenis, deskripsi }) {
  const supabase = createClient();
  const { error } = await supabase
    .from("tracker_makan")
    .insert({ user_id: userId, jenis, deskripsi });
  if (error) throw error;
  await tambahPoin(userId, 2);
}

export async function hapusTrackerMakan(id) {
  const supabase = createClient();
  const { error } = await supabase.from("tracker_makan").delete().eq("id", id);
  if (error) throw error;
}

export async function getTrackerAktivitas(userId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tracker_aktivitas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function tambahTrackerAktivitas(userId, { jenis, durasiMenit }) {
  const supabase = createClient();
  const { error } = await supabase
    .from("tracker_aktivitas")
    .insert({ user_id: userId, jenis, durasi_menit: durasiMenit });
  if (error) throw error;
  await tambahPoin(userId, 3);
}

export async function hapusTrackerAktivitas(id) {
  const supabase = createClient();
  const { error } = await supabase.from("tracker_aktivitas").delete().eq("id", id);
  if (error) throw error;
}

// ================== POIN & BADGE ==================

export async function tambahPoin(userId, jumlah) {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("poin_total")
    .eq("id", userId)
    .single();
  const total = (profile?.poin_total ?? 0) + jumlah;
  await supabase.from("profiles").update({ poin_total: total }).eq("id", userId);
  return total;
}

export async function getProfile(userId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function tambahBadge(userId, badgeCode) {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_badges")
    .insert({ user_id: userId, badge_code: badgeCode });
  if (error && error.code !== "23505") throw error;
}

export async function getBadges(userId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_badges")
    .select("badge_code")
    .eq("user_id", userId);
  if (error) throw error;
  return data.map((d) => d.badge_code);
}

// ================== ADMIN: MATERI ==================

export async function adminGetMateriById(id) {
  const supabase = createClient();
  const { data, error } = await supabase.from("materi").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function adminCreateMateri(payload) {
  const supabase = createClient();
  const { error } = await supabase.from("materi").insert(payload);
  if (error) throw error;
}

export async function adminUpdateMateri(id, payload) {
  const supabase = createClient();
  const { error } = await supabase
    .from("materi")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function adminDeleteMateri(id) {
  const supabase = createClient();
  const { error } = await supabase.from("materi").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadInfografis(file, materiSlug) {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${materiSlug}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("infografis")
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("infografis").getPublicUrl(path);
  return data.publicUrl;
}

// ================== ADMIN: SOAL KUIS ==================

export async function adminGetAllSoal() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("soal_kuis")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminGetSoalById(id) {
  const supabase = createClient();
  const { data, error } = await supabase.from("soal_kuis").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function adminCreateSoal(payload) {
  const supabase = createClient();
  const { error } = await supabase.from("soal_kuis").insert(payload);
  if (error) throw error;
}

export async function adminUpdateSoal(id, payload) {
  const supabase = createClient();
  const { error } = await supabase.from("soal_kuis").update(payload).eq("id", id);
  if (error) throw error;
}

export async function adminDeleteSoal(id) {
  const supabase = createClient();
  const { error } = await supabase.from("soal_kuis").delete().eq("id", id);
  if (error) throw error;
}

export async function adminToggleSoalAktif(id, aktif) {
  const supabase = createClient();
  const { error } = await supabase.from("soal_kuis").update({ aktif }).eq("id", id);
  if (error) throw error;
}

// ================== ADMIN: KELOLA USER ==================

export async function adminListUsers() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("admin_list_users");
  if (error) throw error;
  return data;
}

export async function adminSetRole(targetId, newRole) {
  const supabase = createClient();
  const { error } = await supabase.rpc("admin_set_role", {
    target_id: targetId,
    new_role: newRole,
  });
  if (error) throw error;
}

export async function adminDeleteUser(targetId) {
  const supabase = createClient();
  const { error } = await supabase.rpc("admin_delete_user", { target_id: targetId });
  if (error) throw error;
}
