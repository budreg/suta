-- ================================================
-- MIGRATION: Kelola User untuk Admin Panel
-- Jalankan di Supabase Dashboard > SQL Editor
-- (Tambahan setelah schema.sql yang sudah dijalankan sebelumnya)
-- ================================================

-- Fungsi: admin melihat daftar semua user + statistik ringkas
-- security definer = jalan dengan hak akses tinggi, TAPI dibatasi manual
-- di dalam fungsi supaya cuma admin yang bisa panggil ini.
create or replace function admin_list_users()
returns table (
  id uuid,
  email text,
  nama text,
  role text,
  poin_total integer,
  created_at timestamptz,
  materi_selesai bigint,
  skor_terbaik integer
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Akses ditolak: hanya admin yang bisa melihat daftar user.';
  end if;

  return query
    select
      u.id,
      u.email,
      p.nama,
      p.role,
      p.poin_total,
      p.created_at,
      (select count(*) from materi_progress mp where mp.user_id = u.id) as materi_selesai,
      coalesce((select max(skor_persen) from kuis_riwayat kr where kr.user_id = u.id), 0) as skor_terbaik
    from auth.users u
    join profiles p on p.id = u.id
    order by p.created_at desc;
end;
$$;

grant execute on function admin_list_users() to authenticated;

-- Fungsi: admin ubah role user (jadikan admin / kembalikan jadi user biasa)
create or replace function admin_set_role(target_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Akses ditolak.';
  end if;
  if new_role not in ('user', 'admin') then
    raise exception 'Role tidak valid.';
  end if;
  if target_id = auth.uid() and new_role = 'user' then
    raise exception 'Tidak bisa menurunkan role akun sendiri.';
  end if;

  update profiles set role = new_role where id = target_id;
end;
$$;

grant execute on function admin_set_role(uuid, text) to authenticated;

-- Fungsi: admin hapus akun user (data terkait ikut terhapus otomatis via cascade)
create or replace function admin_delete_user(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Akses ditolak.';
  end if;
  if target_id = auth.uid() then
    raise exception 'Tidak bisa menghapus akun sendiri.';
  end if;

  delete from auth.users where id = target_id;
end;
$$;

grant execute on function admin_delete_user(uuid) to authenticated;
