"use client";
import { useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nama } },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    setSukses(true);
  }

  if (sukses) {
    return (
      <div className="max-w-sm mx-auto py-16 text-center space-y-4">
        <div className="text-4xl">📬</div>
        <h1 className="text-xl font-bold text-slate-900">Cek email kamu</h1>
        <p className="text-slate-500 text-sm">
          Kami sudah kirim link konfirmasi ke <b>{email}</b>. Klik link itu untuk
          mengaktifkan akun, lalu login.
        </p>
        <Link href="/login" className="text-emerald-600 font-medium text-sm">
          ← Kembali ke halaman login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto py-10">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🩺</div>
        <h1 className="text-2xl font-bold text-slate-900">Daftar Akun Baru</h1>
        <p className="text-slate-500 text-sm mt-1">Mulai belajar dan lacak progressmu.</p>
      </div>

      <Card>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Nama</label>
            <input
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
              placeholder="Nama kamu"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>
      </Card>

      <p className="text-center text-sm text-slate-500 mt-4">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-emerald-600 font-medium">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
