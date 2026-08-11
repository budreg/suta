"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email atau password salah."
          : error.message
      );
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto py-10">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🩺</div>
        <h1 className="text-2xl font-bold text-slate-900">Masuk ke DiabetesEdu</h1>
        <p className="text-slate-500 text-sm mt-1">Lanjutkan belajar dan pantau progressmu.</p>
      </div>

      <Card>
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </Card>

      <p className="text-center text-sm text-slate-500 mt-4">
        Belum punya akun?{" "}
        <Link href="/register" className="text-emerald-600 font-medium">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
