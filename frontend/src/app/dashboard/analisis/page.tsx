"use client";

import React, { useEffect, useState } from "react";
import { analisisService } from "@/services/analisis";
import {
  PriceAnalysisResponse,
  ProductAnalysisResponse,
  FinancialAnalysisResponse,
  InsightsResponse,
} from "@/types/analisis";
import { formatRupiah, formatPercent } from "@/lib/format";

type TabType = "wawasan" | "finansial" | "produk" | "harga";

export default function AnalisisPage() {
  const [activeTab, setActiveTab] = useState<TabType>("wawasan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [insightsData, setInsightsData] = useState<InsightsResponse | null>(null);
  const [financialData, setFinancialData] = useState<FinancialAnalysisResponse | null>(null);
  const [productData, setProductData] = useState<ProductAnalysisResponse | null>(null);
  const [priceData, setPriceData] = useState<PriceAnalysisResponse | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [insights, finance, products, prices] = await Promise.all([
        analisisService.getInsights(),
        analisisService.getFinancialAnalysis(),
        analisisService.getProductAnalysis(),
        analisisService.getPriceAnalysis(),
      ]);
      setInsightsData(insights);
      setFinancialData(finance);
      setProductData(products);
      setPriceData(prices);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat data analisis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stitch-border pb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-stitch-typography tracking-tight truncate">Analisis & Wawasan Bisnis</h1>
          <p className="text-xs text-stitch-muted mt-0.5">
            Evaluasi performa produk, margin keuntungan, dan status penetapan harga pasar
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="w-full sm:w-auto min-h-[40px] inline-flex items-center justify-center rounded-xl border border-stitch-border bg-stitch-surface px-4 py-2 text-xs font-semibold text-stitch-muted hover:bg-stitch-canvas active:bg-stitch-border/40 disabled:opacity-50 transition-colors shadow-sm"
        >
          Muat Ulang
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stitch-border text-xs font-medium overflow-x-auto scrollbar-none gap-1 pb-px">
        <button
          onClick={() => setActiveTab("wawasan")}
          className={`whitespace-nowrap border-b-2 px-3.5 sm:px-4 py-3 min-h-[44px] transition flex items-center ${activeTab === "wawasan"
              ? "border-stitch-primary text-stitch-primary font-semibold"
              : "border-transparent text-stitch-muted hover:text-stitch-typography"
            }`}
        >
          <span>Wawasan & Peringatan</span>
          {insightsData && (insightsData.warnings.length > 0 || insightsData.insights.length > 0) && (
            <span className="ml-1.5 rounded-full bg-stitch-border/40 px-1.5 py-0.5 text-[10px] text-stitch-muted">
              {insightsData.warnings.length + insightsData.insights.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("finansial")}
          className={`whitespace-nowrap border-b-2 px-3.5 sm:px-4 py-3 min-h-[44px] transition flex items-center ${activeTab === "finansial"
              ? "border-stitch-primary text-stitch-primary font-semibold"
              : "border-transparent text-stitch-muted hover:text-stitch-typography"
            }`}
        >
          Analisis Finansial
        </button>

        <button
          onClick={() => setActiveTab("produk")}
          className={`whitespace-nowrap border-b-2 px-3.5 sm:px-4 py-3 min-h-[44px] transition flex items-center ${activeTab === "produk"
              ? "border-stitch-primary text-stitch-primary font-semibold"
              : "border-transparent text-stitch-muted hover:text-stitch-typography"
            }`}
        >
          Kinerja Produk
        </button>

        <button
          onClick={() => setActiveTab("harga")}
          className={`whitespace-nowrap border-b-2 px-3.5 sm:px-4 py-3 min-h-[44px] transition flex items-center ${activeTab === "harga"
              ? "border-stitch-primary text-stitch-primary font-semibold"
              : "border-transparent text-stitch-muted hover:text-stitch-typography"
            }`}
        >
          Analisis Harga Jual
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between rounded border border-stitch-danger-bg bg-stitch-danger-bg/30 p-3 text-xs text-stitch-danger-text">
          <span>{error}</span>
          <button onClick={fetchData} className="font-medium underline hover:text-red-900 ml-2">
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="rounded border border-stitch-border bg-stitch-surface p-12 text-center text-xs text-stitch-muted">
          Memuat data analisis...
        </div>
      ) : (
        <>
          {/* TAB 1: WAWASAN & PERINGATAN */}
          {activeTab === "wawasan" && (
            <div className="space-y-4">
              {/* Warnings Section */}
              <div>
                <h2 className="text-sm font-bold text-stitch-typography mb-2">Peringatan Sistem</h2>
                {!insightsData?.warnings || insightsData.warnings.length === 0 ? (
                  <div className="rounded border border-stitch-border bg-stitch-surface p-4 text-xs text-stitch-muted">
                    Tidak ada peringatan. Operasional berjalan aman.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {insightsData.warnings.map((w, idx) => {
                      const isDanger = w.severity === "danger";
                      const isWarning = w.severity === "warning";
                      return (
                        <div
                          key={w.id || idx}
                          className={`rounded border p-3 text-xs ${isDanger
                              ? "border-stitch-danger-bg bg-stitch-danger-bg/30 text-stitch-danger-text"
                              : isWarning
                                ? "border-stitch-pending-bg bg-stitch-pending-bg/30 text-stitch-pending-text"
                                : "border-stitch-success-bg bg-stitch-success-bg/30 text-stitch-success-text"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${isDanger
                                  ? "bg-stitch-danger-text/20 text-stitch-danger-text"
                                  : isWarning
                                    ? "bg-stitch-warning/20 text-stitch-warning"
                                    : "bg-stitch-primary/20 text-stitch-primary"
                                }`}
                            >
                              {w.severity}
                            </span>
                            <span className="font-semibold">{w.title}</span>
                          </div>
                          <p className="mt-1 text-stitch-muted">{w.message}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Insights Section */}
              <div>
                <h2 className="text-sm font-bold text-stitch-typography mb-2">Wawasan & Rekomendasi</h2>
                {!insightsData?.insights || insightsData.insights.length === 0 ? (
                  <div className="rounded border border-stitch-border bg-stitch-surface p-4 text-xs text-stitch-muted">
                    Belum ada wawasan yang cukup untuk periode ini. Tambahkan transaksi untuk kalkulasi.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {insightsData.insights.map((item, idx) => {
                      const isPositive = item.tipe === "positif";
                      const isAttention = item.tipe === "perhatian";
                      return (
                        <div
                          key={item.id || idx}
                          className="rounded border border-stitch-border bg-stitch-surface p-3 text-xs shadow-xs"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-medium text-stitch-muted">{item.kategori}</span>
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${isPositive
                                  ? "bg-stitch-success-bg text-green-700"
                                  : isAttention
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-stitch-border/40 text-stitch-muted"
                                }`}
                            >
                              {item.tipe}
                            </span>
                          </div>
                          <p className="text-stitch-typography">{item.pesan}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ANALISIS FINANSIAL */}
          {activeTab === "finansial" && (
            <div className="space-y-4">
              {/* Growth Metrics */}
              {financialData && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded border border-stitch-border bg-stitch-surface p-3">
                    <div className="text-xs text-stitch-muted">Pertumbuhan Omzet</div>
                    <div
                      className={`text-lg font-bold mt-1 ${financialData.perubahan_omzet_persen >= 0
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {financialData.perubahan_omzet_persen > 0 ? "+" : ""}
                      {formatPercent(financialData.perubahan_omzet_persen)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Dibandingkan periode sebelumnya
                    </div>
                  </div>

                  <div className="rounded border border-stitch-border bg-stitch-surface p-3">
                    <div className="text-xs text-stitch-muted">Pertumbuhan Laba Bersih</div>
                    <div
                      className={`text-lg font-bold mt-1 ${financialData.perubahan_laba_bersih_persen >= 0
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {financialData.perubahan_laba_bersih_persen > 0 ? "+" : ""}
                      {formatPercent(financialData.perubahan_laba_bersih_persen)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Dibandingkan periode sebelumnya
                    </div>
                  </div>

                  <div className="rounded border border-stitch-border bg-stitch-surface p-3">
                    <div className="text-xs text-stitch-muted">Perubahan Beban Pengeluaran</div>
                    <div
                      className={`text-lg font-bold mt-1 ${financialData.perubahan_pengeluaran_persen <= 0
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {financialData.perubahan_pengeluaran_persen > 0 ? "+" : ""}
                      {formatPercent(financialData.perubahan_pengeluaran_persen)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Dibandingkan periode sebelumnya
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              <div className="rounded-2xl border border-stitch-border bg-stitch-surface overflow-hidden shadow-sm">
                <div className="border-b border-stitch-border bg-stitch-canvas px-4 py-3 font-semibold text-xs text-stitch-typography">
                  Perbandingan Periode Ini vs Periode Lalu
                </div>
                {financialData ? (
                  <div className="overflow-x-auto table-responsive">
                    <table className="w-full text-left text-xs min-w-[440px]">
                      <thead className="border-b border-stitch-border bg-stitch-surface font-semibold text-stitch-muted">
                        <tr>
                          <th className="px-4 py-2.5 whitespace-nowrap">Komponen Keuangan</th>
                          <th className="px-4 py-2.5 text-right whitespace-nowrap">Periode Lalu</th>
                          <th className="px-4 py-2.5 text-right whitespace-nowrap">Periode Ini</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-stitch-canvas/50">
                          <td className="px-4 py-2.5 text-stitch-muted whitespace-nowrap">Total Omzet / Pendapatan</td>
                          <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                            {formatRupiah(financialData.periode_lalu.omzet)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-stitch-typography whitespace-nowrap">
                            {formatRupiah(financialData.periode_ini.omzet)}
                          </td>
                        </tr>
                        <tr className="hover:bg-stitch-canvas/50">
                          <td className="px-4 py-2.5 text-stitch-muted whitespace-nowrap">Harga Pokok Penjualan (HPP)</td>
                          <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                            {formatRupiah(financialData.periode_lalu.hpp)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-stitch-typography whitespace-nowrap">
                            {formatRupiah(financialData.periode_ini.hpp)}
                          </td>
                        </tr>
                        <tr className="hover:bg-stitch-canvas/50">
                          <td className="px-4 py-2.5 text-stitch-muted whitespace-nowrap">Laba Kotor</td>
                          <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                            {formatRupiah(financialData.periode_lalu.laba_kotor)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-stitch-typography whitespace-nowrap">
                            {formatRupiah(financialData.periode_ini.laba_kotor)}
                          </td>
                        </tr>
                        <tr className="hover:bg-stitch-canvas/50">
                          <td className="px-4 py-2.5 text-stitch-muted whitespace-nowrap">Beban Pengeluaran Operasional</td>
                          <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                            {formatRupiah(financialData.periode_lalu.pengeluaran)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-stitch-typography whitespace-nowrap">
                            {formatRupiah(financialData.periode_ini.pengeluaran)}
                          </td>
                        </tr>
                        <tr className="bg-stitch-canvas/60">
                          <td className="px-4 py-2.5 font-bold text-stitch-typography whitespace-nowrap">Laba Bersih</td>
                          <td className="px-4 py-2.5 text-right font-medium text-stitch-muted whitespace-nowrap">
                            {formatRupiah(financialData.periode_lalu.laba_bersih)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold text-blue-600 whitespace-nowrap">
                            {formatRupiah(financialData.periode_ini.laba_bersih)}
                          </td>
                        </tr>
                        <tr className="hover:bg-stitch-canvas/50">
                          <td className="px-4 py-2.5 text-stitch-muted whitespace-nowrap">Margin Laba Bersih (%)</td>
                          <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                            {formatPercent(financialData.periode_lalu.margin_persen)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-stitch-typography whitespace-nowrap">
                            {formatPercent(financialData.periode_ini.margin_persen)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-xs text-stitch-muted">Data keuangan tidak tersedia.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: KINERJA PRODUK */}
          {activeTab === "produk" && (
            <div className="space-y-4">
              {/* Highlight Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Produk Terlaris */}
                <div className="rounded border border-stitch-border bg-stitch-surface p-3">
                  <div className="text-xs font-semibold text-stitch-muted mb-2">
                    🔥 Produk Terlaris (Volume)
                  </div>
                  {productData?.produk_terlaris && productData.produk_terlaris.length > 0 ? (
                    <ul className="divide-y divide-slate-100 text-xs">
                      {productData.produk_terlaris.slice(0, 3).map((p) => (
                        <li key={p.product_id} className="flex justify-between py-1.5">
                          <span className="text-stitch-typography truncate mr-2">{p.nama_produk}</span>
                          <span className="font-semibold text-stitch-muted whitespace-nowrap">
                            {p.total_terjual} terjual
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-slate-400">Belum ada data penjualan</div>
                  )}
                </div>

                {/* Margin Tertinggi */}
                <div className="rounded border border-stitch-border bg-stitch-surface p-3">
                  <div className="text-xs font-semibold text-stitch-muted mb-2">
                    💎 Margin Tertinggi
                  </div>
                  {productData?.produk_margin_tertinggi &&
                    productData.produk_margin_tertinggi.length > 0 ? (
                    <ul className="divide-y divide-slate-100 text-xs">
                      {productData.produk_margin_tertinggi.slice(0, 3).map((p) => (
                        <li key={p.product_id} className="flex justify-between py-1.5">
                          <span className="text-stitch-typography truncate mr-2">{p.nama_produk}</span>
                          <span className="font-semibold text-green-600 whitespace-nowrap">
                            {formatPercent(p.margin_persen)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-slate-400">Belum ada data</div>
                  )}
                </div>

                {/* Perhatian: Margin Rendah */}
                <div className="rounded border border-amber-200 bg-amber-50/40 p-3">
                  <div className="text-xs font-semibold text-amber-800 mb-2">
                    ⚠️ Laris Tapi Margin Rendah
                  </div>
                  {productData?.produk_laris_margin_rendah &&
                    productData.produk_laris_margin_rendah.length > 0 ? (
                    <ul className="divide-y divide-amber-100 text-xs">
                      {productData.produk_laris_margin_rendah.slice(0, 3).map((p) => (
                        <li key={p.product_id} className="flex justify-between py-1.5">
                          <span className="text-amber-900 truncate mr-2">{p.nama_produk}</span>
                          <span className="font-semibold text-amber-700 whitespace-nowrap">
                            {formatPercent(p.margin_persen)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-slate-400">Tidak ada produk dalam kriteria ini</div>
                  )}
                </div>
              </div>

              {/* Full Product Performance Table */}
              <div className="rounded-2xl border border-stitch-border bg-stitch-surface overflow-hidden shadow-sm">
                <div className="border-b border-stitch-border bg-stitch-canvas px-4 py-3 font-semibold text-xs text-stitch-typography">
                  Daftar Kinerja Seluruh Produk
                </div>
                {!productData?.semua_produk || productData.semua_produk.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Belum ada data penjualan produk.
                  </div>
                ) : (
                  <div className="overflow-x-auto table-responsive">
                    <table className="w-full text-left text-xs min-w-[540px]">
                      <thead className="border-b border-stitch-border bg-stitch-canvas font-semibold text-stitch-muted">
                        <tr>
                          <th className="px-4 py-2.5 whitespace-nowrap">Produk</th>
                          <th className="px-4 py-2.5 whitespace-nowrap">Kategori</th>
                          <th className="px-4 py-2.5 text-right whitespace-nowrap">Terjual</th>
                          <th className="px-4 py-2.5 text-right whitespace-nowrap">Total Omzet</th>
                          <th className="px-4 py-2.5 text-right whitespace-nowrap">Total Laba</th>
                          <th className="px-4 py-2.5 text-right whitespace-nowrap">Margin (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {productData.semua_produk.map((p) => (
                          <tr key={p.product_id} className="hover:bg-stitch-canvas/60">
                            <td className="px-4 py-2.5 font-medium text-stitch-typography whitespace-nowrap">{p.nama_produk}</td>
                            <td className="px-4 py-2.5 text-stitch-muted whitespace-nowrap">{p.kategori || "-"}</td>
                            <td className="px-4 py-2.5 text-right font-medium text-stitch-muted whitespace-nowrap">
                              {p.total_terjual}
                            </td>
                            <td className="px-4 py-2.5 text-right text-stitch-typography whitespace-nowrap">
                              {formatRupiah(p.total_omzet)}
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium text-green-600 whitespace-nowrap">
                              {formatRupiah(p.total_laba)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                              {formatPercent(p.margin_persen)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ANALISIS HARGA JUAL */}
          {activeTab === "harga" && (
            <div className="rounded-2xl border border-stitch-border bg-stitch-surface overflow-hidden shadow-sm">
              <div className="border-b border-stitch-border bg-stitch-canvas px-4 py-3 font-semibold text-xs text-stitch-typography">
                Evaluasi Harga Jual vs Referensi Pasar
              </div>
              {!priceData?.items || priceData.items.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Belum ada data analisis harga jual.
                </div>
              ) : (
                <div className="overflow-x-auto table-responsive">
                  <table className="w-full text-left text-xs min-w-[680px]">
                    <thead className="border-b border-stitch-border bg-stitch-canvas font-semibold text-stitch-muted">
                      <tr>
                        <th className="px-4 py-2.5 whitespace-nowrap">Produk</th>
                        <th className="px-4 py-2.5 text-right whitespace-nowrap">Harga Modal</th>
                        <th className="px-4 py-2.5 text-right whitespace-nowrap">Harga Jual</th>
                        <th className="px-4 py-2.5 text-right whitespace-nowrap">Margin (%)</th>
                        <th className="px-4 py-2.5 text-center whitespace-nowrap">Rentang Referensi</th>
                        <th className="px-4 py-2.5 whitespace-nowrap">Status Harga</th>
                        <th className="px-4 py-2.5 whitespace-nowrap">Rekomendasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {priceData.items.map((item) => {
                        const status = item.status;
                        const isUnder = status === "Di bawah referensi";
                        const isFair = status === "Dalam rentang wajar";
                        const isOver = status === "Di atas referensi";

                        return (
                          <tr key={item.product_id} className="hover:bg-stitch-canvas/60">
                            <td className="px-4 py-2.5 font-medium text-stitch-typography whitespace-nowrap">
                              {item.nama_produk}
                              <div className="text-[11px] text-slate-400">
                                {item.satuan} {item.kategori ? `• ${item.kategori}` : ""}
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                              {formatRupiah(item.harga_modal)}
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium text-stitch-typography whitespace-nowrap">
                              {formatRupiah(item.harga_jual)}
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium text-stitch-muted whitespace-nowrap">
                              {formatPercent(item.margin_persen)}
                            </td>
                            <td className="px-4 py-2.5 text-center text-stitch-muted whitespace-nowrap">
                              {item.harga_min_ref && item.harga_max_ref ? (
                                `${formatRupiah(item.harga_min_ref)} - ${formatRupiah(
                                  item.harga_max_ref
                                )}`
                              ) : (
                                <span className="text-slate-400">Belum ada</span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 whitespace-nowrap">
                              <span
                                className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${isFair
                                    ? "bg-stitch-success-bg text-green-700"
                                    : isUnder
                                      ? "bg-amber-100 text-amber-700"
                                      : isOver
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-stitch-border/40 text-stitch-muted"
                                  }`}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-stitch-muted min-w-[180px] max-w-xs break-words">
                              {item.rekomendasi}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

