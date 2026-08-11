"use client";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { useAuth } from "@/lib/AuthContext";
import { adminListUsers, adminSetRole, adminDeleteUser } from "@/lib/db";

export default function AdminUsersList() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function muat() {
    setError("");
    try {
      const data = await adminListUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Gagal memuat daftar user.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    muat();
  }, []);

  async function ubahRole(id, roleSaatIni) {
    const roleBaru = roleSaatIni === "admin" ? "user" : "admin";
    const konfirmasi = confirm(
      roleBaru === "admin"
        ? "Jadikan user ini admin? Mereka akan bisa kelola materi, soal, dan user lain."
        : "Turunkan user ini jadi user biasa?"
    );
    if (!konfirmasi) return;

    setBusyId(id);
    try {
      await adminSetRole(id, roleBaru);
      await muat();
    } catch (err) {
      alert(err.message || "Gagal mengubah role.");
    } finally {
      setBusyId(null);
    }
  }

  async function hapusUser(id, nama) {
    const konfirmasi = confirm(
      `Hapus akun "${nama}"? Semua data (progress, tracker, riwayat kuis) akan ikut terhapus permanen.`
    );
    if (!konfirmasi) return;

    setBusyId(id);
    try {
      await adminDeleteUser(id);
      await muat();
    } catch (err) {
      alert(err.message || "Gagal menghapus user.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-slate-400 dark:text-slate-500 text-sm">Memuat...</p>;

  if (error) {
    return (
      <Card>
        <p className="text-sm text-rose-600 font-medium">{error}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          Kemungkinan file <code>supabase/migration_kelola_user.sql</code> belum dijalankan
          di Supabase SQL Editor.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">{users.length} user terdaftar</p>

      <div className="space-y-2">
        {users.map((u) => {
          const isSelf = u.id === currentUser?.id;
          return (
            <Card key={u.id}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{u.nama || "(tanpa nama)"}</p>
                    {u.role === "admin" && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        Admin
                      </span>
                    )}
                    {isSelf && (
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-full">
                        Kamu
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">{u.email}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {u.poin_total} poin · {u.materi_selesai} materi selesai · skor kuis terbaik {u.skor_terbaik}% · daftar {new Date(u.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={busyId === u.id || (isSelf && u.role === "admin")}
                    onClick={() => ubahRole(u.id, u.role)}
                    className="text-sm text-sky-600 font-medium px-3 py-1.5 rounded-lg hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {u.role === "admin" ? "Jadikan User" : "Jadikan Admin"}
                  </button>
                  <button
                    disabled={busyId === u.id || isSelf}
                    onClick={() => hapusUser(u.id, u.nama)}
                    className="text-sm text-rose-600 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
