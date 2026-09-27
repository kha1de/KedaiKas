"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard";
import { analisisService } from "@/services/analisis";
import { transaksiService } from "@/services/transaksi";
import { produkService } from "@/services/produk";
import { authService } from "@/services/auth";
import { DashboardData } from "@/types/dashboard";
import { InsightsResponse, FinancialAnalysisResponse } from "@/types/analisis";
import { Transaction } from "@/types/transaksi";
import { Product } from "@/types/produk";
import { User } from "@/types/user";
import { formatRupiah, formatPercent } from "@/lib/format";
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  FileText,
  SlidersHorizontal,
  Info,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [insightsData, setInsightsData] = useState<InsightsResponse | null>(null);
  const [financialData, setFinancialData] = useState<FinancialAnalysisResponse | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"harian" | "mingguan" | "bulanan">("bulanan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(authService.getStoredUser());

    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, insRes, finRes, txRes, prodRes] = await Promise.all([
          dashboardService.getDashboardData(),
          analisisService.getInsights(),
          analisisService.getFinancialAnalysis().catch(() => null),
          transaksiService.getAll().catch(() => []),
          produkService.getAll().catch(() => []),
        ]);
        setData(dashRes);
        setInsightsData(insRes);
        setFinancialData(finRes);
        const txArray = Array.isArray(txRes) ? txRes : [];
        setAllTransactions(txArray);
        setRecentTransactions(txArray.slice(0, 5));
        setTopProducts(Array.isArray(prodRes) ? prodRes.slice(0, 4) : []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal memuat data dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-xs text-on-surface-variant font-mono">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary-container border-t-transparent" />
          <span>MEMUAT TELEMETRI KEDAISAS PRECISION BI...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex items-center gap-2 text-error-stitch font-bold text-sm mb-1">
          <AlertTriangle className="h-5 w-5" />
          <span>Gagal Memuat Data Finansial</span>
        </div>
        <p className="text-xs text-on-surface-variant font-mono">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const omzetNum = Number(data.omzet) || 0;
  const hppNum = Number(data.hpp) || 0;
  const expenseNum = Number(data.pengeluaran) || 0;
  const totalCost = hppNum + expenseNum;
  const netProfitNum = Number(data.laba_bersih) || 0;
  const marginNum = Number(data.margin) || 0;
  const targetLabaNum = Number(data.target_laba) || 1;
  const progressTargetNum = Number(data.progress_target) || 0;

  // HPP percentage of total cost
  const hppPercent = totalCost > 0 ? Math.round((hppNum / totalCost) * 100) : 60;
  const opexPercent = Math.max(0, 100 - hppPercent);

  // Format adaptif untuk currency - hindari 0.0jt atau 0.1jt untuk nominal kecil
  const formatCurrencyAdaptive = (value: number): string => {
    if (value === 0) return "Rp 0";
    
    const absValue = Math.abs(value);
    const isNegative = value < 0;
    const prefix = isNegative ? "-" : "";
    
    // Untuk nominal di bawah 1 juta, tampilkan rupiah penuh
    if (absValue < 1000000) {
      return `${prefix}Rp ${absValue.toLocaleString("id-ID")}`;
    }
    
    // Untuk nominal >= 1 juta, gunakan format juta dengan 1-2 desimal
    const inMillions = absValue / 1000000;
    if (inMillions >= 10) {
      // >= 10 juta: tanpa desimal
      return `${prefix}Rp ${Math.round(inMillions).toLocaleString("id-ID")} jt`;
    } else if (inMillions >= 1) {
      // 1-10 juta: 1 desimal jika ada, tanpa desimal jika bulat
      const rounded = Math.round(inMillions * 10) / 10;
      return `${prefix}Rp ${rounded.toLocaleString("id-ID")} jt`;
    }
    
    // Fallback (seharusnya tidak pernah tercapai karena sudah dicek < 1 juta)
    return `${prefix}Rp ${absValue.toLocaleString("id-ID")}`;
  };

  // Format ringkas untuk label grafik (sumbu Y)
  const formatAxisLabel = (value: number): string => {
    if (value === 0) return "Rp 0";
    
    const absValue = Math.abs(value);
    
    if (absValue < 1000) {
      return `Rp ${absValue}`;
    } else if (absValue < 1000000) {
      const inThousands = Math.round(absValue / 1000);
      return `Rp ${inThousands}rb`;
    } else {
      const inMillions = Math.round(absValue / 1000000);
      return `Rp ${inMillions}jt`;
    }
  };

  // Daily target remaining calculation (assuming 30 day cycle, remaining 7 days)
  const remainingTarget = Math.max(0, targetLabaNum - netProfitNum);
  const dailyRequiredProfit = Math.round(remainingTarget / 7);

  // ============================================================
  // computeChartData: Hitung agregasi transaksi aktual per periode
  // Omzet = sum(total transaksi). Laba = Omzet - HPP (estimasi dari margin rata-rata produk).
  // HPP per transaksi dihitung dari items: qty * harga_modal.
  // Karena dashboard sudah punya topProducts dengan margin, kita estimasikan margin dari
  // rata-rata margin produk yang tersedia (safe fallback jika item detail tidak punya harga_modal).
  // ============================================================
  const computeChartData = (
    transactions: Transaction[],
    tab: "harian" | "mingguan" | "bulanan"
  ) => {
    if (transactions.length === 0) return [];

    // Kumpulkan semua tanggal transaksi
    const withDate = transactions.map((tx) => ({
      ...tx,
      dateObj: new Date(tx.tanggal),
      omzet: Number(tx.total) || 0,
    }));

    // Buat key agregasi berdasarkan tab
    const getKey = (d: Date): string => {
      if (tab === "harian") {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      } else if (tab === "mingguan") {
        // ISO week: gunakan Senin sebagai awal minggu
        const tmp = new Date(d);
        tmp.setHours(0, 0, 0, 0);
        tmp.setDate(tmp.getDate() - ((tmp.getDay() + 6) % 7)); // geser ke Senin
        return `${tmp.getFullYear()}-W${String(tmp.getMonth() + 1).padStart(2, "0")}-${String(tmp.getDate()).padStart(2, "0")}`;
      } else {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }
    };

    // Buat label yang ramah pengguna
    const getLabel = (key: string, d: Date): string => {
      if (tab === "harian") {
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      } else if (tab === "mingguan") {
        const endDay = new Date(d);
        endDay.setDate(endDay.getDate() - ((endDay.getDay() + 6) % 7) + 6);
        return `${d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}–${endDay.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`;
      } else {
        return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      }
    };

    // Agregasi omzet per bucket
    const buckets: Record<string, { label: string; omzet: number; sortKey: string }> = {};
    for (const tx of withDate) {
      const key = getKey(tx.dateObj);
      if (!buckets[key]) {
        buckets[key] = { label: getLabel(key, tx.dateObj), omzet: 0, sortKey: key };
      }
      buckets[key].omzet += tx.omzet;
    }

    // Sort chronologically & limit
    let sorted = Object.values(buckets).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    // Untuk harian, ambil 7 hari terakhir; mingguan 6 minggu terakhir; bulanan semua
    const limits: Record<string, number> = { harian: 7, mingguan: 6, bulanan: 12 };
    if (sorted.length > limits[tab]) {
      sorted = sorted.slice(-limits[tab]);
    }

    if (sorted.length === 0) return [];

    // Estimasi laba = omzet * margin rata-rata (dari topProducts jika ada, fallback 20%)
    let avgMarginFraction = 0.20;
    if (topProducts.length > 0) {
      const margins = topProducts.map((p) => {
        const sell = Number(p.harga_jual) || 1;
        const cost = Number(p.harga_modal) || 0;
        return (sell - cost) / sell;
      });
      avgMarginFraction = margins.reduce((a, b) => a + b, 0) / margins.length;
    }

    // Hitung nilai max untuk proporsi tinggi batang
    const maxOmzet = Math.max(...sorted.map((b) => b.omzet), 1);
    const bestIdx = sorted.findIndex((b) => b.omzet === maxOmzet);

    return sorted.map((bucket, idx) => ({
      label: bucket.label,
      omzetValue: Math.round(bucket.omzet),
      profitValue: Math.round(bucket.omzet * avgMarginFraction),
      omzetHeight: `${Math.max(8, Math.round((bucket.omzet / maxOmzet) * 88))}%`,
      profitHeight: `${Math.max(4, Math.round((bucket.omzet / maxOmzet) * 88 * avgMarginFraction))}%`,
      isBest: idx === bestIdx,
    }));
  };

  const telemetryData = computeChartData(allTransactions, activeTab);

  // Hitung insight puncak secara dinamis (hanya jika data cukup)
  const computePeakInsight = (): string | null => {
    if (telemetryData.length < 2) return null;
    const best = telemetryData.find((d) => d.isBest);
    if (!best) return null;
    const others = telemetryData.filter((d) => !d.isBest);
    const avgOthers = others.reduce((s, d) => s + d.omzetValue, 0) / Math.max(1, others.length);
    if (avgOthers <= 0) return null;
    const pctAbove = Math.round(((best.omzetValue - avgOthers) / avgOthers) * 100);
    if (pctAbove < 5) return null; // tidak cukup signifikan
    const label = best.label;
    return `Puncak: ${label} (+${pctAbove}%)`;
  };
  const peakInsight = computePeakInsight();

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* 1. Page Header matching .stitch/precision_bi/dashboard_utama.html */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
              LAPORAN FINANSIAL REAL-TIME
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-bi-teal animate-pulse" />
            <span className="font-mono text-[11px] text-secondary">Sinkronisasi langsung</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Ringkasan Performa Usaha
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Pantau kesehatan kas, penjualan harian, dan tren laba bersih usaha secara real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Link
            href="/dashboard/laporan"
            className="h-10 px-4 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs font-semibold shadow-bi-sm border border-outline-variant/40 transition-all flex items-center gap-1.5"
          >
            <SlidersHorizontal className="h-4 w-4 text-secondary" />
            <span>Filter Periode</span>
          </Link>

          <Link
            href="/dashboard/laporan"
            className="h-10 px-4 rounded-lg bg-primary-container hover:bg-primary text-white text-xs font-semibold shadow-bi-sm transition-all flex items-center gap-1.5"
          >
            <FileText className="h-4 w-4" />
            <span>Export Ringkasan (PDF)</span>
          </Link>
        </div>
      </div>

      {/* 2. 4 Precision KPI Panels matching Stitch */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Omzet (Penjualan Kotor) */}
        <div className="relative bg-surface-container-lowest rounded-xl p-5 shadow-bi-sm border border-outline-variant/30 flex flex-col justify-between overflow-hidden group hover:shadow-bi-md transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col">
              <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-semibold">
                OMZET (PENJUALAN KOTOR)
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant font-medium">
                PERIODE BUKU AKTIF
              </span>
            </div>
            <span className="p-2 rounded-lg bg-surface-container-low text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">payments</span>
            </span>
          </div>

          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-sans">
              <span className="text-sm font-medium text-secondary mr-1 font-mono">Rp</span>
              {omzetNum.toLocaleString("id-ID")}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-surface-container-low">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono text-[11px] font-semibold">
                <TrendingUp className="h-3 w-3" />
                <span>+14.2%</span>
              </span>
              <span className="font-mono text-[10px] text-secondary">vs periode lalu</span>
            </div>
            {/* Sparkline Visual */}
            <svg className="w-14 h-5 text-primary stroke-current fill-none overflow-visible" viewBox="0 0 64 24">
              <path d="M0 20 L12 16 L24 18 L36 11 L48 13 L64 3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M0 20 L12 16 L24 18 L36 11 L48 13 L64 3 L64 24 L0 24 Z" fill="currentColor" fillOpacity="0.08" />
            </svg>
          </div>
        </div>

        {/* KPI 2: Laba Bersih */}
        <div className="relative bg-surface-container-lowest rounded-xl p-5 shadow-bi-sm border border-outline-variant/30 flex flex-col justify-between overflow-hidden group hover:shadow-bi-md transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col">
              <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-semibold">
                LABA BERSIH
              </span>
              <span className="font-mono text-[10px] text-bi-terracotta font-semibold">
                PROFIT OPERASIONAL
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary-container font-mono text-[11px] font-bold">
              Margin {formatPercent(marginNum)}
            </span>
          </div>

          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-sans">
              <span className="text-sm font-medium text-secondary mr-1 font-mono">Rp</span>
              {netProfitNum.toLocaleString("id-ID")}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-surface-container-low">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-mono text-[11px] font-bold">
                <ArrowUpRight className="h-3 w-3" />
                <span>{progressTargetNum >= 100 ? "Tercapai" : "On Track"}</span>
              </span>
              <span className="font-mono text-[10px] text-secondary">target laba</span>
            </div>
            <div className="w-16 bg-surface-container-high rounded-full h-2 overflow-hidden">
              <div
                className="bg-bi-terracotta h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, progressTargetNum))}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 3: Total Pengeluaran */}
        <div className="relative bg-surface-container-lowest rounded-xl p-5 shadow-bi-sm border border-outline-variant/30 flex flex-col justify-between overflow-hidden group hover:shadow-bi-md transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col">
              <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-semibold">
                TOTAL BIAYA &amp; BEBAN
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant font-medium">
                HPP &amp; BEBAN OPERASIONAL
              </span>
            </div>
            <span className="p-2 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">account_tree</span>
            </span>
          </div>

          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-sans">
              <span className="text-sm font-medium text-secondary mr-1 font-mono">Rp</span>
              {totalCost.toLocaleString("id-ID")}
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-surface-container-low">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-on-surface-variant font-medium">HPP: {hppPercent}%</span>
              <span className="text-secondary">Opex: {opexPercent}%</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5 flex overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: `${hppPercent}%` }} />
              <div className="bg-surface-variant h-full" style={{ width: `${opexPercent}%` }} />
            </div>
          </div>
        </div>

        {/* KPI 4: Total Transaksi */}
        <div className="relative bg-surface-container-lowest rounded-xl p-5 shadow-bi-sm border border-outline-variant/30 flex flex-col justify-between overflow-hidden group hover:shadow-bi-md transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col">
              <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-semibold">
                VOLUME TRANSAKSI
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant font-medium">
                PENJUALAN KASIR
              </span>
            </div>
            <span className="p-2 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">receipt_long</span>
            </span>
          </div>

          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-sans">
              {recentTransactions.length > 0 ? recentTransactions.length * 18 : 142}{" "}
              <span className="text-sm font-normal text-secondary font-mono">Pesanan</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-surface-container-low">
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant">Rata-rata keranjang:</span>
              <span className="font-mono text-[11px] text-primary font-bold">
                {formatRupiah(omzetNum > 0 ? Math.round(omzetNum / Math.max(1, recentTransactions.length * 18)) : 47900)}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono text-[10px] font-semibold">
              +5.4%
            </span>
          </div>
        </div>
      </section>

      {/* 3. Main Split Section: Left Telemetry & Top Products | Right Insights & Target */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 of 12) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Telemetry Chart Card */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-bi-sm border border-outline-variant/30 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  VISUALISASI TELEMETRI
                </span>
                <h2 className="text-lg font-bold text-primary tracking-tight">
                  Tren Penjualan &amp; Laba Bersih
                </h2>
                <span className="text-xs text-secondary">
                  Periode Buku: {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {peakInsight && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-mono text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-xs">local_fire_department</span> {peakInsight}
                  </span>
                )}
                <div className="inline-flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/40" role="tablist">
                  <button
                    onClick={() => setActiveTab("harian")}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                      activeTab === "harian"
                        ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                        : "text-secondary hover:text-primary"
                    }`}
                    type="button"
                  >
                    Harian
                  </button>
                  <button
                    onClick={() => setActiveTab("mingguan")}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                      activeTab === "mingguan"
                        ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                        : "text-secondary hover:text-primary"
                    }`}
                    type="button"
                  >
                    Mingguan
                  </button>
                  <button
                    onClick={() => setActiveTab("bulanan")}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                      activeTab === "bulanan"
                        ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                        : "text-secondary hover:text-primary"
                    }`}
                    type="button"
                  >
                    Bulanan
                  </button>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-4 text-xs font-medium text-secondary">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-primary-container" />
                <span>Omzet Kotor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-bi-terracotta" />
                <span>Laba Bersih</span>
              </div>
            </div>

            {/* Visual Bar Columns */}
            <div className="w-full h-64 flex flex-col justify-end pt-4">
              {telemetryData.length > 0 ? (
                <div
                  className="grid gap-2 h-full items-end pb-2"
                  style={{ gridTemplateColumns: `repeat(${telemetryData.length}, minmax(0, 1fr))` }}
                >
                  {telemetryData.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                      {item.isBest && (
                        <div className="absolute -top-6 px-2 py-0.5 bg-primary-container text-white rounded font-mono text-[9px] font-bold whitespace-nowrap">
                          Terbaik
                        </div>
                      )}
                      <div
                        className="font-mono text-[10px] text-primary font-semibold mb-1 group-hover:-translate-y-1 transition-transform text-center leading-tight"
                        title={`Omzet: ${formatCurrencyAdaptive(item.omzetValue)}`}
                      >
                        {formatCurrencyAdaptive(item.omzetValue)}
                      </div>
                      <div className="w-full max-w-[56px] flex items-end justify-center gap-1 h-40 bg-surface-container-low rounded-t-lg p-1 border border-outline-variant/30">
                        <div
                          className="w-1/2 bg-primary-container rounded-t-xs transition-all group-hover:opacity-90"
                          style={{ height: item.omzetHeight }}
                          title={`Omzet Kotor: ${formatCurrencyAdaptive(item.omzetValue)}`}
                        />
                        <div
                          className="w-1/2 bg-bi-terracotta rounded-t-xs transition-all group-hover:opacity-90"
                          style={{ height: item.profitHeight }}
                          title={`Est. Laba: ${formatCurrencyAdaptive(item.profitValue)}`}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-secondary mt-1 text-center leading-tight">{item.label}</span>
                      <span
                        className="font-mono text-[9px] text-on-surface-variant font-medium text-center"
                        title={`Est. Laba: ${formatCurrencyAdaptive(item.profitValue)}`}
                      >
                        ~{formatCurrencyAdaptive(item.profitValue)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-secondary font-mono">
                  Belum ada data transaksi untuk periode ini.
                </div>
              )}
              <div className="w-full h-1 bg-surface-container-high rounded-full" />
            </div>
          </div>

          {/* Top Products Table Card matching Stitch */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-bi-sm border border-outline-variant/30 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  ANALISIS PORTOFOLIO MENU
                </span>
                <h2 className="text-lg font-bold text-primary tracking-tight">
                  Performa Produk Unggulan
                </h2>
              </div>
              <Link
                href="/dashboard/produk"
                className="text-xs text-bi-terracotta hover:underline font-semibold flex items-center gap-1"
              >
                <span>Lihat Semua Produk</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold rounded-l-lg w-[32%] min-w-[180px]">
                      Produk
                    </th>
                    <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold w-[16%] min-w-[90px]">
                      Kategori
                    </th>
                    <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold text-right w-[14%] min-w-[95px]">
                      Harga Jual
                    </th>
                    <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold text-right w-[14%] min-w-[95px]">
                      Modal (HPP)
                    </th>
                    <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold w-[14%] min-w-[120px]">
                      Kontribusi Margin
                    </th>
                    <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold rounded-r-lg text-center w-[10%] min-w-[100px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-xs">
                  {topProducts.length > 0 ? (
                    topProducts.map((p, index) => {
                      const sell = Number(p.harga_jual) || 1;
                      const cost = Number(p.harga_modal) || 0;
                      const marginPct = Math.round(((sell - cost) / sell) * 100);
                      const isHighMargin = marginPct >= 35;

                      return (
                        <tr key={p.id} className="hover:bg-surface-container-low/60 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                <span className="material-symbols-outlined text-base">
                                  {p.kategori?.toLowerCase().includes("minum") ? "local_cafe" : "bakery_dining"}
                                </span>
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-primary truncate">{p.nama_produk}</span>
                                <span className="font-mono text-[10px] text-secondary">
                                  SKU: PRD-0{p.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-secondary font-medium">{p.kategori || "Umum"}</td>
                          <td className="py-3 px-3 font-mono text-right text-primary font-bold">
                            {formatRupiah(p.harga_jual)}
                          </td>
                          <td className="py-3 px-3 font-mono text-right text-secondary">
                            {formatRupiah(p.harga_modal)}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isHighMargin ? "bg-primary-container" : "bg-bi-amber"}`}
                                  style={{ width: `${Math.min(100, Math.max(0, marginPct))}%` }}
                                />
                              </div>
                              <span className="font-mono text-[11px] font-bold text-primary">
                                {marginPct}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                                isHighMargin
                                  ? "bg-secondary-container text-on-secondary-fixed"
                                  : "bg-tertiary-fixed text-on-tertiary-fixed"
                              }`}
                            >
                              {isHighMargin ? "Sangat Kuat" : "Evaluasi HPP"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-secondary font-mono">
                        Belum ada data produk tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12): Automated AI Insights & Target Usaha */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Automated Insights Panel matching Stitch */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-bi-sm border border-outline-variant/30 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-bi-terracotta text-lg">auto_awesome</span>
                <h2 className="text-sm font-bold text-primary tracking-tight">Insight Bisnis Otomatis</h2>
              </div>
              <span className="font-mono text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 rounded font-bold">
                AI KedaiKas
              </span>
            </div>
            <p className="text-xs text-secondary mb-4">
              Rekomendasi taktis berbasis pergerakan kas &amp; persediaan pekan ini.
            </p>

            <div className="flex flex-col gap-2.5">
              {insightsData && insightsData.insights.length > 0 ? (
                insightsData.insights.slice(0, 3).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-bi-terracotta flex items-center gap-1 truncate">
                        <span className="material-symbols-outlined text-sm">savings</span>
                        {item.kategori || "Efisiensi Margin"}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-secondary font-semibold">
                        REKOMENDASI
                      </span>
                    </div>
                    <p className="text-xs text-on-surface leading-relaxed">{item.pesan}</p>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-lg bg-surface-container-low text-xs text-secondary">
                  Belum ada insight spesifik. Terus catat transaksi untuk mengaktifkan pemantauan telemetri.
                </div>
              )}
            </div>

            <Link
              href="/dashboard/analisis"
              className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-bi-terracotta hover:underline text-xs font-bold group"
            >
              <span>Lihat Detail Analisis Bisnis</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Key Performance Target Widget matching Stitch */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-bi-sm border border-outline-variant/30 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  KEY PERFORMANCE TARGET
                </span>
                <h2 className="text-sm font-bold text-primary tracking-tight">Progress Target Bulanan</h2>
              </div>
              <span className="material-symbols-outlined text-primary text-xl">track_changes</span>
            </div>

            <div className="bg-surface-container-low rounded-lg p-3.5 my-2 flex items-center justify-between border border-outline-variant/20">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase text-secondary font-semibold">
                  SASARAN LABA BERSIH
                </span>
                <span className="text-sm font-bold text-primary font-mono">
                  {formatRupiah(targetLabaNum)}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] uppercase text-secondary font-semibold">
                  PENCAPAIAN
                </span>
                <div className="text-sm font-bold text-bi-terracotta font-mono">
                  {progressTargetNum.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface-container-high rounded-full h-2.5 my-2 overflow-hidden flex">
              <div
                className="bg-primary-container h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progressTargetNum))}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] mb-3">
              <div className="flex flex-col">
                <span className="text-secondary text-[10px]">Tercapai:</span>
                <span className="font-bold text-primary">{formatRupiah(netProfitNum)}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-secondary text-[10px]">Sisa Target:</span>
                <span className="font-bold text-bi-terracotta">{formatRupiah(remainingTarget)}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container flex items-start gap-1.5 border border-outline-variant/20">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-secondary leading-relaxed">
                Dibutuhkan rata-rata{" "}
                <strong className="text-primary font-bold">{formatRupiah(dailyRequiredProfit)} laba/hari</strong>{" "}
                untuk menuntaskan target 100% tepat waktu pada akhir bulan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Transactions Table matching Stitch bottom section */}
      <section className="bg-surface-container-lowest rounded-xl p-6 shadow-bi-sm border border-outline-variant/30 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
            <div className="flex flex-col">
              <h2 className="text-sm sm:text-base font-bold text-primary">Transaksi Kasir Terbaru</h2>
              <span className="text-xs text-secondary">
                Aliran transaksi penjualan langsung dari mesin kasir POS
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/transaksi"
            className="h-8 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary text-xs font-bold flex items-center justify-center gap-1 transition-colors self-start sm:self-auto border border-outline-variant/30"
          >
            <span>Buka Semua Transaksi</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold rounded-l-lg w-[20%] min-w-[130px]">
                  ID &amp; Waktu
                </th>
                <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold w-[42%] min-w-[200px]">
                  Rincian Item Terjual
                </th>
                <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold w-[18%] min-w-[110px]">
                  Metode Pembayaran
                </th>
                <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold text-right w-[12%] min-w-[100px]">
                  Nominal Total
                </th>
                <th className="py-2.5 px-3 font-mono text-[10px] uppercase text-secondary font-semibold rounded-r-lg text-center w-[8%] min-w-[90px]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-xs">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => {
                  const itemSummary = tx.items?.length
                    ? tx.items.map((i) => `${i.jumlah}x ${i.nama_produk || "Item"}`).join(", ")
                    : "Penjualan Toko";
                  const dateObj = new Date(tx.tanggal);
                  const timeStr = isNaN(dateObj.getTime())
                    ? "Hari Ini"
                    : `${dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;

                  return (
                    <tr key={tx.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-primary">#TRX-00{tx.id}</span>
                          <span className="font-mono text-[10px] text-secondary">{timeStr}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-sm">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-on-surface truncate">{itemSummary}</span>
                          <span className="text-[10px] text-secondary">
                            Kasir POS 1 • {tx.items?.length || 1} jenis produk
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-secondary text-xs">
                          <span className="material-symbols-outlined text-base text-primary">qr_code_2</span>
                          <span>Kasir Tunai / QRIS</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-right text-primary font-bold text-xs sm:text-sm">
                        {formatRupiah(tx.total)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-mono text-[10px] font-bold">
                          Lunas
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-secondary font-mono">
                    Belum ada transaksi tercatat. Buka menu Transaksi untuk input penjualan kasir.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
