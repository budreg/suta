-- ================================================
-- MIGRATION: Infografis
-- Jalankan di Supabase Dashboard > SQL Editor (New Query)
-- ================================================

-- 1. Tambah kolom infografis_url di tabel materi
alter table materi add column if not exists infografis_url text;

-- 2. Buat storage bucket untuk simpan gambar infografis (public, bisa diakses tanpa login)
insert into storage.buckets (id, name, public)
values ('infografis', 'infografis', true)
on conflict (id) do nothing;

-- 3. Siapa saja boleh LIHAT gambar (perlu, karena ditampilkan di halaman materi)
create policy "infografis_public_read"
on storage.objects for select
using (bucket_id = 'infografis');

-- 4. Hanya admin boleh UPLOAD gambar baru
create policy "infografis_admin_upload"
on storage.objects for insert
with check (
  bucket_id = 'infografis'
  and exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- 5. Hanya admin boleh HAPUS/GANTI gambar
create policy "infografis_admin_delete"
on storage.objects for delete
using (
  bucket_id = 'infografis'
  and exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

create policy "infografis_admin_update"
on storage.objects for update
using (
  bucket_id = 'infografis'
  and exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
