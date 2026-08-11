-- ================================================
-- FIX #1 + FIX #2 digabung (jalankan yang ini saja, sudah final)
-- FIX #1: kolom "id"/"role" ambigu dengan nama kolom output fungsi
-- FIX #2: kolom auth.users.email bertipe varchar, bukan text, perlu di-cast
-- ================================================

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
  if not exists (
    select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ) then
    raise exception 'Akses ditolak: hanya admin yang bisa melihat daftar user.';
  end if;

  return query
    select
      u.id,
      u.email::text,
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
