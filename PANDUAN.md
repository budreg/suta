# DiabetesEdu — Panduan Cepat

Aplikasi edukasi diabetes interaktif. Stack: **Next.js + Tailwind CSS + Supabase**
(database + autentikasi).

## Setup Awal (WAJIB sebelum menjalankan)

**1. Isi API key Supabase**

Copy `.env.local.example` jadi `.env.local`, lalu isi dengan API key dari
Supabase Dashboard → Project Settings → API:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi_anon_public_key_disini
```

**2. Jalankan SQL schema**

Buka Supabase Dashboard → SQL Editor → New Query. Copy-paste seluruh isi file
`supabase/schema.sql`, lalu klik Run. Ini akan membuat semua tabel, keamanan
data (RLS), dan mengisi 6 materi + 6 soal kuis contoh.

**3. Install & jalankan**

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` — akan otomatis diarahkan ke halaman **Register**
karena belum ada akun. Daftar akun baru, cek email untuk konfirmasi (Supabase
kirim email otomatis), lalu login.

## Struktur Project

```
app/
  login/, register/       -> Halaman autentikasi
  page.jsx                -> Dashboard (poin, progress, menu)
  materi/, materi/[slug]/ -> Materi edukasi (dari database)
  kuis/                   -> Kuis interaktif (dari database)
  tracker/                -> Tracker makan & aktivitas (per-user, di database)
  simulasi/               -> Kalkulator risiko gaya hidup
lib/
  supabase/client.js      -> Koneksi Supabase (browser)
  supabase/server.js      -> Koneksi Supabase (server component)
  db.js                   -> Semua fungsi query database (materi, kuis, tracker, dst)
  AuthContext.jsx         -> React context untuk status login
  youtube.js               -> Helper thumbnail video
middleware.js              -> Proteksi halaman: harus login untuk akses selain /login /register
supabase/schema.sql        -> Schema database + data awal (jalankan di Supabase dashboard)
data/materi.js, data/kuis.js -> SUDAH TIDAK DIPAKAI (konten sekarang di database), disimpan sebagai referensi/backup
```

## Yang Sudah Jalan

- ✅ **Login & Register** — pakai email/password via Supabase Auth
- ✅ **Database** — semua data (progress, skor, tracker, poin, badge) tersimpan per-user di Postgres, bukan localStorage lagi
- ✅ Materi edukasi 6 topik + video (klik thumbnail buka YouTube)
- ✅ Kuis 6 soal dengan skor & penjelasan
- ✅ Tracker pola makan & aktivitas fisik
- ✅ Simulasi risiko gaya hidup
- ✅ Gamifikasi: poin, progress tracker, badge

## Yang Belum (langkah selanjutnya)

- ❌ **Admin Panel** — untuk kelola materi/soal tanpa edit SQL manual. Ini nyusul.
- ❌ **Infografis** — belum ada gambar infografis, baru teks + video
- ❌ **Animasi** — baru transisi hover sederhana, belum animasi 2D
- Role admin: sudah ada kolom `role` di tabel `profiles`, defaultnya `'user'`.
  Untuk jadikan akunmu admin, jalankan di SQL Editor Supabase:
  ```sql
  update profiles set role = 'admin' where id = (select id from auth.users where email = 'emailmu@contoh.com');
  ```

## Cara Cepat Menambah/Edit Konten (sementara, sebelum admin panel jadi)

Buka Supabase Dashboard → Table Editor → pilih tabel `materi` atau `soal_kuis`,
edit langsung dari situ (seperti spreadsheet). Setelah admin panel jadi, ini
bisa dilakukan dari dalam aplikasi.

## Deploy Cepat (Vercel)

1. Push ke GitHub (`.env.local` otomatis tidak ikut ter-push, aman)
2. vercel.com → New Project → import repo
3. Di halaman setup Vercel, isi Environment Variables: `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (sama seperti di `.env.local`)
4. Deploy

