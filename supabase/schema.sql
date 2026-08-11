-- ================================================
-- DIABETESEDU - SUPABASE SCHEMA
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor
-- ================================================

-- 1. PROFILES (data tambahan user, termasuk role admin)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text,
  role text default 'user' check (role in ('user', 'admin')),
  poin_total integer default 0,
  created_at timestamptz default now()
);

-- 2. MATERI (konten edukasi - dikelola lewat admin panel)
create table if not exists materi (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kategori text not null,
  judul text not null,
  ringkasan text,
  konten jsonb not null default '[]',
  video_url text,
  urutan integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. SOAL KUIS (dikelola lewat admin panel)
create table if not exists soal_kuis (
  id uuid primary key default gen_random_uuid(),
  pertanyaan text not null,
  pilihan jsonb not null,
  jawaban_benar integer not null,
  penjelasan text,
  aktif boolean default true,
  created_at timestamptz default now()
);

-- 4. PROGRESS MATERI (materi yang sudah diselesaikan tiap user)
create table if not exists materi_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  materi_slug text not null,
  selesai_at timestamptz default now(),
  unique (user_id, materi_slug)
);

-- 5. RIWAYAT KUIS
create table if not exists kuis_riwayat (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  skor_persen integer not null,
  jumlah_benar integer not null,
  jumlah_soal integer not null,
  created_at timestamptz default now()
);

-- 6. TRACKER POLA MAKAN
create table if not exists tracker_makan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  jenis text not null,
  deskripsi text not null,
  created_at timestamptz default now()
);

-- 7. TRACKER AKTIVITAS FISIK
create table if not exists tracker_aktivitas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  jenis text not null,
  durasi_menit integer not null,
  created_at timestamptz default now()
);

-- 8. BADGES / REWARD
create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  badge_code text not null,
  earned_at timestamptz default now(),
  unique (user_id, badge_code)
);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- Wajib diaktifkan supaya user cuma bisa akses data miliknya sendiri
-- ================================================

alter table profiles enable row level security;
alter table materi enable row level security;
alter table soal_kuis enable row level security;
alter table materi_progress enable row level security;
alter table kuis_riwayat enable row level security;
alter table tracker_makan enable row level security;
alter table tracker_aktivitas enable row level security;
alter table user_badges enable row level security;

-- PROFILES: user bisa lihat & edit profil sendiri
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);

-- MATERI & SOAL_KUIS: semua orang (termasuk belum login) boleh baca; hanya admin boleh ubah
create policy "materi_select_all" on materi for select using (true);
create policy "materi_admin_write" on materi for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "soal_select_all" on soal_kuis for select using (true);
create policy "soal_admin_write" on soal_kuis for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- DATA USER: hanya boleh akses data milik sendiri
create policy "materi_progress_own" on materi_progress for all using (auth.uid() = user_id);
create policy "kuis_riwayat_own" on kuis_riwayat for all using (auth.uid() = user_id);
create policy "tracker_makan_own" on tracker_makan for all using (auth.uid() = user_id);
create policy "tracker_aktivitas_own" on tracker_aktivitas for all using (auth.uid() = user_id);
create policy "user_badges_own" on user_badges for all using (auth.uid() = user_id);

-- ================================================
-- TRIGGER: otomatis buat baris profiles saat user baru register
-- ================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nama)
  values (new.id, coalesce(new.raw_user_meta_data->>'nama', new.email));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ================================================
-- SEED DATA: 6 materi dari bahan Diabetes Melitus Pada Remaja
-- ================================================
insert into materi (slug, kategori, judul, ringkasan, konten, video_url, urutan) values
('penyebab-dm', 'Penyebab', 'Apa Itu Diabetes Melitus dan Penyebabnya?',
 'Kenali definisi, jenis, dan faktor risiko diabetes pada remaja.',
 '["Diabetes melitus (DM) adalah penyakit metabolik kronis yang ditandai dengan kadar gula darah tinggi (hiperglikemia), akibat gangguan produksi insulin, kerja insulin, atau keduanya (American Diabetes Association, 2025).","Pada remaja, dua tipe yang paling sering dijumpai: Diabetes Tipe 1 (DMT1), disebabkan reaksi autoimun yang merusak sel penghasil insulin di pankreas; dan Diabetes Tipe 2 (DMT2), terjadi akibat resistensi insulin disertai penurunan fungsi sel penghasil insulin (American Diabetes Association, 2025).","Faktor risiko diabetes pada remaja meliputi: riwayat keluarga dengan diabetes, berat badan berlebih/obesitas, kurang aktivitas fisik, pola makan tinggi kalori dan gula, riwayat diabetes gestasional pada ibu, hipertensi, PCOS pada remaja perempuan, serta perubahan hormon saat pubertas (American Diabetes Association, 2025).","Diagnosis diabetes mengikuti kriteria ADA: glukosa plasma puasa >=126 mg/dL, glukosa plasma 2 jam setelah TTGO >=200 mg/dL, HbA1c >=6,5%, atau glukosa plasma sewaktu >=200 mg/dL disertai gejala klasik."]'::jsonb,
 'https://www.youtube.com/watch?v=GANTI_DENGAN_ID_VIDEO', 1),

('gejala-diabetes', 'Gejala', 'Kenali Gejala Diabetes pada Remaja',
 'Tanda-tanda yang perlu diwaspadai, jangan diabaikan.',
 '["Gejala diabetes pada remaja bisa muncul perlahan atau mendadak. Gejala klasik yang paling sering ditemukan: sering buang air kecil (poliuria), sering merasa haus (polidipsia), dan nafsu makan meningkat (polifagia) (IDAI, 2026).","Gejala lain: berat badan turun tanpa sebab jelas, mudah lelah, penglihatan kabur, luka sulit sembuh, serta infeksi kulit atau jamur berulang.","Jika dibiarkan, diabetes dapat menurunkan konsentrasi belajar, membuat tubuh mudah terkena infeksi, dan merusak mata, ginjal, saraf, dan jantung (American Diabetes Association, 2026).","Jika kamu atau temanmu mengalami beberapa gejala di atas bersamaan, segera periksakan diri ke dokter atau puskesmas terdekat."]'::jsonb,
 'https://www.youtube.com/watch?v=GANTI_DENGAN_ID_VIDEO', 2),

('pola-makan-sehat', 'Nutrisi', 'Pola Makan Sehat ala Isi Piringku',
 'Panduan porsi makan gizi seimbang untuk cegah diabetes.',
 '["Panduan Isi Piringku dari Kemenkes RI membagi porsi makan tiap kali makan: 1/3 makanan pokok, 1/3 sayuran, 1/6 lauk pauk, dan 1/6 buah-buahan (Kemenkes RI, 2022).","Makanan Pokok (1/3 piring): sumber tenaga dari nasi, jagung, kentang, atau roti. Sayuran (1/3 piring): sumber vitamin dan serat dari bayam, brokoli, wortel, atau kangkung.","Lauk Pauk (1/6 piring): protein dari ikan, ayam, telur, tahu, atau tempe. Buah-buahan (1/6 piring): vitamin dari pisang, pepaya, jeruk, atau apel (Kemenkes RI, 2022).","Kebiasaan pendukung: minum air putih 8 gelas sehari, bergerak aktif minimal 30 menit sehari, cuci tangan pakai sabun sebelum dan sesudah makan.","Tips: perbanyak sayur-buah, lebih sering masak sendiri daripada makanan cepat saji, ganti minuman manis dengan air putih, jangan lewatkan sarapan, batasi (bukan hindari total) makanan tinggi gula/garam/lemak (Kemenkes RI, 2023)."]'::jsonb,
 'https://www.youtube.com/watch?v=GANTI_DENGAN_ID_VIDEO', 3),

('aktivitas-fisik', 'Aktivitas', 'Aktivitas Fisik yang Menyenangkan',
 'Olahraga tidak harus di lapangan, yang penting aktif bergerak.',
 '["Aktivitas fisik membantu tubuh lebih sensitif terhadap insulin. Remaja disarankan aktif bergerak setidaknya 60 menit setiap hari (WHO, 2020).","Aktivitas sehari-hari: jalan kaki atau bersepeda ke sekolah, bermain sepak bola, basket, voli, atau bulu tangkis bersama teman.","Pilihan lain: menari mengikuti musik favorit, jogging bersama keluarga, berenang, atau ikut senam.","Kebiasaan duduk terlalu lama (gim, media sosial) membuat tubuh kurang sensitif terhadap insulin dan meningkatkan risiko diabetes (Arslanian et al., 2018). Selingi waktu layar dengan gerak aktif tiap 1-2 jam."]'::jsonb,
 'https://www.youtube.com/watch?v=GANTI_DENGAN_ID_VIDEO', 4),

('manajemen-stres', 'Kesehatan Mental', 'Mengelola Stres dengan Cara yang Sehat',
 'Stres yang tidak dikelola bisa meningkatkan risiko diabetes.',
 '["Stres yang dibiarkan terus-menerus dapat memengaruhi hormon tubuh, meningkatkan gula darah, dan membuat seseorang memilih makanan manis sebagai pelampiasan (Arslanian et al., 2018).","Cara mengelola stres: tidur cukup setiap malam, berolahraga rutin, mendengarkan musik atau melakukan hobi.","Cara lain: bicara dengan orang tua/guru/sahabat/konselor saat ada masalah, latihan pernapasan saat cemas, kurangi gawai sebelum tidur, susun jadwal belajar (Hockenberry & Wilson, 2023).","Remaja idealnya butuh 8-10 jam tidur per malam. Kurang tidur mengganggu hormon tubuh dan membuat gula darah lebih sulit dikendalikan."]'::jsonb,
 'https://www.youtube.com/watch?v=GANTI_DENGAN_ID_VIDEO', 5),

('pencegahan-penanganan', 'Pencegahan', 'Pencegahan dan Penanganan Diabetes',
 'Langkah konkret mencegah DM Tipe 2 dan gambaran penanganannya.',
 '["Pencegahan DM Tipe 2 melalui perubahan gaya hidup: pola makan gizi seimbang, batasi minuman berpemanis dan makanan cepat saji, aktivitas fisik minimal 60 menit/hari, jaga berat badan ideal, kurangi waktu duduk dan gawai (American Diabetes Association, 2025).","Remaja dengan faktor risiko tinggi (obesitas, riwayat keluarga diabetes) disarankan melakukan skrining gula darah berkala.","Penatalaksanaan bagi yang terdiagnosis: edukasi pasien dan keluarga, terapi nutrisi medis, aktivitas fisik teratur, pemantauan glukosa darah rutin.","Terapi insulin untuk DM Tipe 1; metformin dan/atau insulin untuk DM Tipe 2 sesuai anjuran dokter. Dukungan psikososial keluarga penting untuk kepatuhan terapi (ISPAD, 2022)."]'::jsonb,
 'https://www.youtube.com/watch?v=GANTI_DENGAN_ID_VIDEO', 6)
on conflict (slug) do nothing;

-- ================================================
-- SEED DATA: 6 soal kuis contoh
-- ================================================
insert into soal_kuis (pertanyaan, pilihan, jawaban_benar, penjelasan) values
('Hormon apa yang berfungsi menurunkan kadar gula darah dalam tubuh?',
 '["Insulin", "Adrenalin", "Kortisol", "Tiroksin"]'::jsonb, 0,
 'Insulin diproduksi oleh pankreas dan membantu sel menyerap glukosa dari darah.'),
('Berapa lama minimal aktivitas fisik yang direkomendasikan untuk remaja per hari?',
 '["15 menit", "30 menit", "60 menit", "120 menit"]'::jsonb, 2,
 'Remaja disarankan aktif bergerak setidaknya 60 menit setiap hari (WHO, 2020).'),
('Apa penyebab utama Diabetes Melitus Tipe 1?',
 '["Pola makan tinggi gula", "Reaksi autoimun yang merusak sel penghasil insulin", "Kurang tidur", "Kelebihan berat badan"]'::jsonb, 1,
 'DM Tipe 1 disebabkan reaksi autoimun yang merusak sel penghasil insulin di pankreas.'),
('Menurut panduan Isi Piringku, berapa porsi sayuran dalam satu piring makan?',
 '["1/6", "1/4", "1/3", "1/2"]'::jsonb, 2,
 'Isi Piringku terdiri dari 1/3 makanan pokok, 1/3 sayuran, 1/6 lauk pauk, dan 1/6 buah-buahan.'),
('Berapa jam tidur ideal yang dibutuhkan remaja setiap malam?',
 '["4-5 jam", "6-7 jam", "8-10 jam", "11-12 jam"]'::jsonb, 2,
 'Remaja membutuhkan waktu tidur sekitar 8-10 jam setiap malam untuk menjaga keseimbangan hormon.'),
('Manakah gejala klasik diabetes yang paling sering ditemukan?',
 '["Sering buang air kecil, sering haus, nafsu makan meningkat", "Batuk dan pilek", "Sakit gigi", "Sakit kepala ringan"]'::jsonb, 0,
 'Gejala klasik diabetes meliputi poliuria (sering kencing), polidipsia (sering haus), dan polifagia (nafsu makan meningkat).')
on conflict do nothing;
