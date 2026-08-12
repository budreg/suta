"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    getProfile(user.id).then((p) => setIsAdmin(p?.role === "admin"));
  }, [user]);

  // Tutup menu mobile setiap kali pindah halaman
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Kunci scroll body saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (pathname === "/login" || pathname === "/register") return null;

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const allLinks = isAdmin ? [...links, { href: "/admin", label: "Admin" }] : links;

  function isActive(l) {
    return pathname === l.href || (l.href === "/admin" && pathname.startsWith("/admin"));
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
          DiabetesEdu
        </Link>

        {/* Menu desktop */}
        <div className="hidden sm:flex gap-1 items-center">
          {allLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive(l)
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400"
              }`}
            >
              {l.label}
            </Link>
          ))}
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

        {/* Tombol hamburger (mobile) */}
        <div className="flex sm:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-full bg-current rounded-full origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block h-0.5 w-full bg-current rounded-full"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-full bg-current rounded-full origin-center"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Panel menu mobile (dropdown penuh, bukan scroll horizontal) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="sm:hidden fixed inset-0 top-16 bg-black/30 z-40"
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="sm:hidden fixed left-0 right-0 top-16 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg"
            >
              <div className="flex flex-col p-3 gap-1">
                {allLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition ${
                      isActive(l)
                        ? "bg-emerald-600 text-white"
                        : "text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                {user && (
                  <button
                    onClick={logout}
                    className="mt-1 px-4 py-3 rounded-xl text-base font-medium text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    Keluar
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
