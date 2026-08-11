"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { getProfile } from "@/lib/db";

export default function AdminLayout({ children }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("checking"); // checking, allowed, denied

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    getProfile(user.id).then((profile) => {
      if (profile?.role === "admin") {
        setStatus("allowed");
      } else {
        setStatus("denied");
      }
    });
  }, [user, authLoading, router]);

  if (status === "checking") {
    return <p className="text-center text-slate-400 py-16">Memeriksa akses...</p>;
  }

  if (status === "denied") {
    return (
      <div className="text-center py-16 space-y-2">
        <div className="text-4xl">🔒</div>
        <p className="text-slate-600 font-medium">Halaman ini khusus admin.</p>
        <Link href="/" className="text-emerald-600 text-sm font-medium">
          ← Kembali ke beranda
        </Link>
      </div>
    );
  }

  const tabs = [
    { href: "/admin", label: "Ringkasan" },
    { href: "/admin/materi", label: "Materi" },
    { href: "/admin/kuis", label: "Soal Kuis" },
    { href: "/admin/users", label: "User" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">⚙️ Admin Panel</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola konten materi dan soal kuis.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                active
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
