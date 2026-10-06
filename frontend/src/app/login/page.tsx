"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Shield,
  Sliders,
  QrCode,
  KeyRound,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface DemoAccount {
  id: number;
  nama: string;
  email: string;
  role: string;
  defaultPass: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 3,
    nama: "Darin Hilmi Azzahra",
    email: "dar.hilmi@gmail.com",
    role: "Owner",
    defaultPass: "123",
  },
  {
    id: 2,
    nama: "Daffa Berlliano",
    email: "daf.berlliano@gmail.com",
    role: "Manager",
    defaultPass: "123",
  },
  {
    id: 1,
    nama: "Ahmad Khairul Fatih",
    email: "ah.khairul@gmail.com",
    role: "Kasir",
    defaultPass: "123",
  },
];


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login({ email, password });
      const stored = authService.getStoredUser();
      if (stored?.role === "kasir") {
        router.push("/dashboard/transaksi");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal masuk. Periksa email dan kata sandi Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoAccount = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.defaultPass);
    setError(null);
    showToast(`Akun ${account.nama} dipilih. Klik 'Masuk ke Dashboard'.`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-3 sm:p-6 lg:p-8 bg-surface">
      {/* Authentication Portal Container */}
      <div className="w-full max-w-5xl xl:max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 overflow-hidden min-h-[700px]">
        {/* LEFT SIDE: Analytical Telemetry & Intelligence Showcase (Pure Data / Geometric / Architectural) */}
        <div className="lg:col-span-5 bg-[#102134] text-white hidden md:flex flex-col justify-between p-6 lg:p-8 relative overflow-hidden">
          {/* Background Ambient Geometric Network & Vector Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="auth-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
                </pattern>
                <radialGradient id="navy-glow" cx="20%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#b7c8e1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#102134" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#auth-grid-pattern)" />
              <circle cx="280" cy="180" r="160" fill="url(#navy-glow)" />
            </svg>
          </div>

          {/* Top Header Brand & Status */}
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-tertiary-container flex items-center justify-center shadow-md">
                  <BarChart3 className="text-white h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base tracking-tight leading-tight">KedaiKas</span>
                  <span className="text-[10px] text-on-primary-container tracking-widest uppercase font-mono">
                    Business Intelligence
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-slate-200 font-mono text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse"></span>
                NODE ID-JKT01
              </span>
            </div>

            <div className="mt-2">
              <p className="text-[11px] font-semibold text-on-primary-container uppercase tracking-wider font-mono">
                Arsitektur Analitik Mandiri
              </p>
              <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight mt-1 leading-snug">
                Presisi Fiskal &amp; Prediksi Margin Kasir
              </h2>
              <p className="text-xs text-on-primary-container/90 mt-2 leading-relaxed">
                Platform komputasi metrik real-time untuk optimalisasi rantai pasok, analisis keranjang belanja (basket size), dan proyeksi laba harian gerai retail Anda.
              </p>
            </div>
          </div>

          {/* Center Analytics Telemetry Module (Micro Data Cards) */}
          <div className="relative z-10 my-6 flex flex-col gap-3">
            {/* Telemetry Card 1: POS Sync Health */}
            <div className="bg-[#102134]/80 border border-white/10 backdrop-blur-md p-3.5 rounded-xl shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-secondary-fixed" />
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">
                    Sinkronisasi Kasir / POS Multi-Outlet
                  </span>
                </div>
                <span className="font-mono text-sm text-white font-semibold">99.85%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary-fixed h-full rounded-full transition-all duration-700" style={{ width: "99.85%" }} />
              </div>
              <div className="flex items-center justify-between text-on-primary-container font-mono text-[11px]">
                <span>Latensi Replikasi: 142 ms</span>
                <span className="text-white font-medium">12 Gerai Terhubung</span>
              </div>
            </div>

            {/* Telemetry Card 2: Inline Sparkline Data */}
            <div className="bg-[#102134]/80 border border-white/10 backdrop-blur-md p-3.5 rounded-xl shadow-sm flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wide">
                  Volume Transaksi Bulan Berjalan
                </span>
                <span className="font-mono text-base text-white font-bold mt-0.5">1.428 Transaksi</span>
                <span className="font-mono text-[11px] text-secondary-fixed flex items-center gap-1 mt-0.5 font-semibold">
                  <TrendingUp className="h-3.5 w-3.5" /> +14.2% MoM
                </span>
              </div>
              {/* Sparkline Vector Chart */}
              <div className="w-28 h-12 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                  <path
                    d="M0,35 Q15,28 30,30 T60,18 T85,10 L100,5"
                    fill="none"
                    stroke="#d4e4fc"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,35 Q15,28 30,30 T60,18 T85,10 L100,5 L100,40 L0,40 Z"
                    fill="currentColor"
                    className="text-secondary-fixed/15"
                  />
                  <circle cx="100" cy="5" r="3" fill="#ffb59d" />
                </svg>
              </div>
            </div>

            {/* Telemetry Metrics Grid 2-col */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#102134]/60 border border-white/10 p-3 rounded-xl flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-on-primary-container">
                  <Shield className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">Protokol Sandi</span>
                </div>
                <span className="font-mono text-sm text-white font-bold">AES-256 GCM</span>
                <span className="text-[11px] text-slate-300 opacity-80">Audit ISO 27001</span>
              </div>
              <div className="bg-[#102134]/60 border border-white/10 p-3 rounded-xl flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-on-primary-container">
                  <Sliders className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">Model Prediksi</span>
                </div>
                <span className="font-mono text-sm text-white font-bold">Monte Carlo</span>
                <span className="text-[11px] text-slate-300 opacity-80">Margin CobaDulu™</span>
              </div>
            </div>
          </div>

          {/* Bottom System Telemetry Indicator */}
          <div className="relative z-10 pt-2 flex items-center justify-between text-on-primary-container font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
              <span>KedaiKas Gateway v2.4.9</span>
            </div>
            <span>Koneksi TLS 1.3 Terenkripsi</span>
          </div>
        </div>

        {/* RIGHT SIDE: Formal Authentication Portal Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div className="w-full max-w-md mx-auto flex flex-col">
            {/* Brand Header for Identity Reference */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="flex items-end gap-1 h-7 px-1.5 py-1 bg-primary rounded-md shadow-sm">
                <div className="w-1.5 h-3.5 bg-tertiary-container rounded-xs" />
                <div className="w-1.5 h-4.5 bg-secondary-container rounded-xs" />
                <div className="w-1.5 h-2.5 bg-tertiary-fixed rounded-xs" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline leading-none">
                  <span className="text-base font-bold text-primary tracking-tight">Kedai</span>
                  <span className="text-base font-bold text-tertiary-container tracking-tight">Kas</span>
                </div>
                <span className="text-[10px] font-semibold text-secondary tracking-wider uppercase font-mono mt-0.5">
                  Enterprise Analytics
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1.5 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                Masuk ke Portal KedaiKas
              </h1>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Akses analitik konsolidasi, audit margin kasir, dan simulasi skenario fiskal UMKM Anda.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 rounded-xl bg-error-container/40 p-3.5 text-xs text-on-error-container border border-error/20 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="h-4 w-4 shrink-0 text-error mt-0.5" />
                <div>
                  <span className="font-semibold">Kendala Otentikasi:</span> {error}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Input Email / Identifier */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-primary flex items-center justify-between" htmlFor="identifier">
                  <span>Email Bisnis / No. WhatsApp Pemilik</span>
                  <span className="text-[11px] text-secondary font-normal">Format terdaftar</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-secondary flex items-center pointer-events-none">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="identifier"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@warung.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low text-on-surface text-sm placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary" htmlFor="password">
                    Kata Sandi Akun
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast("Fitur reset sandi: silakan hubungi administrator kedai.")}
                    className="text-xs text-tertiary-container hover:underline font-semibold transition-all"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-secondary flex items-center pointer-events-none">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    ref={passwordInputRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-11 rounded-xl bg-surface-container-low text-on-surface text-sm placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-secondary hover:text-primary p-1 flex items-center justify-center transition-colors"
                    title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox: Ingat Saya & 2FA Status */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary bg-surface-container-low focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
                  />
                  <span className="text-xs text-on-surface">Ingat sesi di peramban ini (30 Hari)</span>
                </label>
                <div className="hidden sm:flex items-center gap-1 text-secondary text-[10px] font-semibold uppercase bg-surface-container px-2 py-0.5 rounded font-mono">
                  <ShieldCheck className="h-3 w-3 text-secondary-stitch" /> 2FA Aktif
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-1 rounded-xl bg-primary hover:bg-primary-container text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Accounts Selection */}
            <div className="mt-5 pt-4 border-t border-stitch-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider font-mono flex items-center gap-1">
                  <span>🚀</span> Akun Demo Terdaftar
                </span>
                <span className="text-[10px] text-secondary font-medium">Klik 1 akun untuk isi cepat</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isSelected = email === acc.email;
                  const roleColorMap: Record<string, string> = {
                    "Owner": "bg-amber-100 text-amber-800 border-amber-200",
                    "Manager": "bg-blue-100 text-blue-800 border-blue-200",
                    "Kasir": "bg-emerald-100 text-emerald-800 border-emerald-200",
                  };
                  const roleBadge = roleColorMap[acc.role] ?? "bg-gray-100 text-gray-700 border-gray-200";
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectDemoAccount(acc)}
                      className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-xs"
                          : "border-stitch-border bg-surface-container-low/50 hover:bg-surface-container hover:border-outline-variant"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-primary truncate">{acc.nama}</span>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </div>
                      <span className={`self-start text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${roleBadge}`}>
                        {acc.role}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Contextual SSO & Security Verification Buttons */}
            <div className="mt-5 pt-4 border-t border-stitch-border/50 flex flex-col gap-2.5">
              <div className="relative flex items-center justify-center">
                <div className="w-full bg-surface-variant h-px" />
                <span className="absolute bg-surface-container-lowest px-3 text-[10px] font-semibold text-secondary uppercase tracking-wider font-mono">
                  Akses Terverifikasi Ekosistem
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => showToast("Gateway QRIS Merchant ID siap dihubungkan.")}
                  className="h-9 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                >
                  <QrCode className="h-3.5 w-3.5 text-secondary" />
                  <span>QRIS Merchant ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast("SSO Mitra Perbankan UMKM siap dihubungkan.")}
                  className="h-9 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                >
                  <KeyRound className="h-3.5 w-3.5 text-secondary" />
                  <span>SSO Mitra Bank</span>
                </button>
              </div>
            </div>

            {/* Registration & Enterprise Link */}
            <div className="mt-5 text-center flex flex-col gap-1">
              <p className="text-xs text-secondary">
                Belum memiliki lisensi gerai KedaiKas?{" "}
                <Link href="/register" className="font-bold text-tertiary-container hover:underline transition-all">
                  Daftarkan Outlet Baru
                </Link>
              </p>
              <p className="text-[11px] text-outline">
                Butuh integrasi API POS kasir eksisting?{" "}
                <button
                  type="button"
                  onClick={() => showToast("Hubungi tim teknis: support@kedaikas.id")}
                  className="text-secondary hover:text-primary underline"
                >
                  Hubungi Tim Solusi Data
                </button>
              </p>
            </div>
          </div>

          {/* Footer Compliance Strip */}
          <div className="w-full pt-4 mt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-secondary font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-tertiary-container" />
              <span>KedaiKas Business Intelligence Platform v2.4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Server Aktif (Jakarta Region)
              </span>
              <span className="text-outline">|</span>
              <button
                type="button"
                onClick={() => showToast("Data terenkripsi sesuai UU Perlindungan Data Pribadi.")}
                className="hover:underline"
              >
                Privasi Fiskal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#102134] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-slideUp border border-white/10">
          <CheckCircle2 className="h-4 w-4 text-secondary-fixed shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}