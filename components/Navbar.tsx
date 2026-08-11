"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { getProfile } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/materi", label: "Materi" },
  { href: "/kuis", label: "Kuis" },
  { href: "/tracker", label: "Tracker" },
  { href: "/simulasi", label: "Simulasi" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    getProfile(user.id).then((p) => setIsAdmin(p?.role === "admin"));
  }, [user]);

  if (pathname === "/login" || pathname === "/register") return null;

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const allLinks = isAdmin ? [...links, { href: "/admin", label: "⚙️ Admin" }] : links;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
          DiabetesEdu
        </Link>
        <div className="hidden sm:flex gap-1 items-center">
          {allLinks.map((l) => {
            const active = pathname === l.href || (l.href === "/admin" && pathname.startsWith("/admin"));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle />
          {user && (
            <button
              onClick={logout}
              className="ml-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 dark:hover:text-rose-400"
            >
              Keluar
            </button>
          )}
        </div>
        {/* mobile nav */}
        <div className="flex sm:hidden gap-1 items-center overflow-x-auto">
          {allLinks.map((l) => {
            const active = pathname === l.href || (l.href === "/admin" && pathname.startsWith("/admin"));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-2 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle />
          {user && (
            <button
              onClick={logout}
              className="px-2 py-1.5 rounded-md text-xs font-medium bg-slate-50 dark:bg-slate-800 text-rose-500 dark:text-rose-400 whitespace-nowrap"
            >
              Keluar
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
