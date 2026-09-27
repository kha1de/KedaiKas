"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.register({ nama, email, password });
      // Automatically login after register
      await authService.login({ email, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Pendaftaran gagal. Silakan coba kembali.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-stitch-canvas">
      <div className="w-full max-w-md rounded-2xl border border-stitch-border bg-stitch-surface p-5 sm:p-8 shadow-warm-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-stitch-primary text-white shadow-warm">
            <span className="text-2xl font-bold">K</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stitch-primary tracking-tight">Daftar Warung Baru</h1>
          <p className="mt-1.5 text-sm text-stitch-muted font-medium">Mulai kelola keuangan & simulasi keputusan bisnis</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-stitch-danger-bg/20/90 p-3.5 text-xs text-stitch-danger-text border border-stitch-danger-bg/80">
            <span className="font-semibold mr-1">Kendala:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stitch-typography mb-1.5">Nama Pemilik / Warung</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Pak Joko (Warung Berkah)"
              className="w-full rounded-xl border border-stitch-border/80 bg-warm-25/40 px-3.5 py-2.5 text-sm text-stitch-typography placeholder-warm-400 focus:border-stitch-secondary focus:bg-stitch-surface focus:outline-none focus:ring-2 focus:ring-stitch-secondary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stitch-typography mb-1.5">Alamat Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joko@warung.com"
              className="w-full rounded-xl border border-stitch-border/80 bg-warm-25/40 px-3.5 py-2.5 text-sm text-stitch-typography placeholder-warm-400 focus:border-stitch-secondary focus:bg-stitch-surface focus:outline-none focus:ring-2 focus:ring-stitch-secondary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stitch-typography mb-1.5">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full rounded-xl border border-stitch-border/80 bg-warm-25/40 px-3.5 py-2.5 text-sm text-stitch-typography placeholder-warm-400 focus:border-stitch-secondary focus:bg-stitch-surface focus:outline-none focus:ring-2 focus:ring-stitch-secondary/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-stitch-primary py-3 text-sm font-semibold text-white shadow-sm hover:bg-stitch-primary/90 active:scale-[0.99] disabled:opacity-50 transition-all"
          >
            {loading ? "Mendaftarkan..." : "Daftarkan Warung"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-stitch-muted">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-stitch-secondary hover:text-forest-900 hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}

