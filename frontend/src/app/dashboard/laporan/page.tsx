"use client";

import React, { useEffect, useState } from "react";
import { laporanService } from "@/services/laporan";
import { ReportData } from "@/types/laporan";
import { formatRupiah, formatPercent, formatDate } from "@/lib/format";

export default function LaporanPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchReport = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await laporanService.getReport(start || undefined, end || undefined);
      setReport(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat laporan bisnis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport(startDate, endDate);
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchReport();
  };

  const handleSetThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    setStartDate(firstDay);
    setEndDate(lastDay);
    fetchReport(firstDay, lastDay);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stitch-border pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stitch-success-bg border border-stitch-primary/20 text-[11px] font-semibold text-stitch-primary mb-1.5">
            <span>📑</span>
            <span>Rekapitulasi Usaha</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stitch-typography font-serif">
            Laporan Bisnis & Keuangan
          </h1>
          <p className="text-xs text-stitch-typography mt-0.5">
            Rekapitulasi berkala pendapatan kotor, beban operasional, laba bersih riil, dan rincian produk
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            disabled={loading || !report}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-stitch-border bg-stitch-surface px-3.5 py-2.5 min-h-[42px] text-xs font-semibold text-stitch-typography hover:bg-stitch-canvas disabled:opacity-50 transition-colors shadow-sm"
          >
            <span>🖨️</span>
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3 rounded-2xl border border-stitch-border bg-stitch-surface p-4 text-xs shadow-sm"
      >
        <div className="w-full sm:w-auto">
          <label className="block font-semibold text-stitch-typography mb-1.5">Dari Tanggal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-stitch-border px-3 py-2 min-h-[42px] text-xs text-stitch-typography focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 bg-stitch-surface"
          />
        </div>
        <div className="w-full sm:w-auto">
          <label className="block font-semibold text-stitch-typography mb-1.5">Sampai Tanggal</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-stitch-border px-3 py-2 min-h-[42px] text-xs text-stitch-typography focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 bg-stitch-surface"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1 w-full sm:w-auto">
          <button
            type="submit"
            className="flex-1 sm:flex-initial rounded-xl bg-stitch-primary px-4 py-2.5 min-h-[42px] font-semibold text-white hover:bg-stitch-primary/90 transition-colors shadow-sm"
          >
            Terapkan Filter
          </button>
          <button
            type="button"
            onClick={handleSetThisMonth}
            className="rounded-xl border border-stitch-border bg-stitch-surface px-3.5 py-2.5 min-h-[42px] text-xs font-semibold text-stitch-typography hover:bg-stitch-canvas transition-colors"
          >
            Bulan Ini
          </button>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="rounded-xl border border-stitch-border bg-stitch-surface px-3 py-2.5 min-h-[42px] text-xs font-medium text-stitch-muted hover:bg-stitch-canvas transition-colors"
            >
              Semua Waktu
            </button>
          )}
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-stitch-danger-bg bg-stitch-danger-bg/20/80 p-4 text-xs text-stitch-danger-text shadow-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchReport(startDate, endDate)}
            className="font-semibold underline hover:text-red-900 ml-2"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="rounded-2xl border border-stitch-border bg-stitch-surface p-12 text-center text-xs text-stitch-muted shadow-sm">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-forest-800 border-t-transparent mb-2"></div>
          <div>Menyusun data laporan keuangan...</div>
        </div>
      ) : !report ? (
        <div className="rounded-2xl border border-stitch-border bg-stitch-surface p-10 text-center text-xs text-stitch-muted shadow-sm">
          Data laporan tidak dapat ditemukan.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Report Meta Info */}
          <div className="rounded-2xl border border-stitch-border bg-stitch-canvas/70 px-5 py-3.5 text-xs text-stitch-typography flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stitch-typography">Periode Laporan:</span>
              <span className="font-semibold text-forest-900">
                {report.periode_mulai && report.periode_selesai
                  ? `${formatDate(report.periode_mulai)} s/d ${formatDate(report.periode_selesai)}`
                  : "Seluruh Periode Pencatatan"}
              </span>
            </div>
            <div className="text-stitch-muted">
              Total Transaksi Terhitung: <strong className="text-stitch-typography font-bold">{report.total_transaksi} transaksi</strong>
            </div>
          </div>

          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="min-w-0 rounded-2xl border border-stitch-border bg-stitch-surface p-4 sm:p-5 shadow-sm">
              <div className="text-[11px] font-medium text-stitch-muted truncate">Total Omzet Penjualan</div>
              <div className="text-lg sm:text-xl font-extrabold text-stitch-typography mt-1 truncate">
                {formatRupiah(report.omzet)}
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-stitch-border bg-stitch-surface p-4 sm:p-5 shadow-sm">
              <div className="text-[11px] font-medium text-stitch-muted truncate">Laba Kotor Usaha</div>
              <div className="text-lg sm:text-xl font-extrabold text-stitch-typography mt-1 truncate">
                {formatRupiah(report.laba_kotor)}
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-stitch-border bg-stitch-surface p-4 sm:p-5 shadow-sm">
              <div className="text-[11px] font-medium text-stitch-muted truncate">Total Beban Operasional</div>
              <div className="text-lg sm:text-xl font-extrabold text-stitch-accent mt-1 truncate">
                {formatRupiah(report.pengeluaran)}
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-stitch-primary/20/80 bg-stitch-success-bg/40 p-4 sm:p-5 shadow-sm">
              <div className="text-[11px] font-medium text-stitch-secondary truncate">Laba Bersih Akhir</div>
              <div className="text-lg sm:text-xl font-extrabold text-forest-900 mt-1 truncate">
                {formatRupiah(report.laba_bersih)}
              </div>
              <div className="text-[11px] font-bold text-stitch-secondary mt-0.5">
                Margin: {formatPercent(report.margin_persen)}
              </div>
            </div>
          </div>

          {/* Ringkasan Laba Rugi Table */}
          <div className="rounded-2xl border border-stitch-border bg-stitch-surface shadow-sm overflow-hidden">
            <div className="border-b border-stitch-border bg-stitch-canvas/70 px-5 py-3.5 font-bold text-xs text-stitch-typography font-serif">
              Laporan Laba / Rugi Ringkas
            </div>
            <div className="p-5 text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Kolom 1: Pendapatan & HPP */}
                <div className="space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-stitch-muted font-semibold pb-1 border-b border-stitch-border">
                    Komponen Pendapatan &amp; Biaya Langsung
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stitch-border/50">
                    <span className="text-stitch-typography font-medium">Total Pendapatan (Omzet)</span>
                    <span className="font-bold text-stitch-typography text-sm">{formatRupiah(report.omzet)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stitch-border/50">
                    <span className="text-stitch-typography font-medium">Harga Pokok Penjualan (HPP)</span>
                    <span className="font-semibold text-stitch-accent text-sm">
                      - {formatRupiah(report.hpp)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-stitch-canvas/80 px-3.5 rounded-xl font-semibold border border-stitch-border/50">
                    <span className="text-stitch-typography font-semibold">Laba Kotor Usaha</span>
                    <span className="text-stitch-typography font-bold text-sm">{formatRupiah(report.laba_kotor)}</span>
                  </div>
                </div>

                {/* Kolom 2: Beban & Laba Bersih */}
                <div className="space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-stitch-muted font-semibold pb-1 border-b border-stitch-border">
                    Beban Operasional &amp; Laba Bersih
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stitch-border/50">
                    <span className="text-stitch-typography font-medium">Total Beban Operasional / Pengeluaran</span>
                    <span className="font-semibold text-stitch-accent text-sm">
                      - {formatRupiah(report.pengeluaran)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 bg-stitch-success-bg/70 px-3.5 rounded-xl font-bold text-sm border border-stitch-primary/20">
                    <span className="text-stitch-primary">Laba Bersih Usaha (Net Profit)</span>
                    <span className="text-stitch-primary font-extrabold text-base">{formatRupiah(report.laba_bersih)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 text-charcoal-600 text-xs px-2">
                    <span className="font-medium">Persentase Margin Bersih</span>
                    <span className="font-bold text-stitch-typography font-mono">
                      {formatPercent(report.margin_persen)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Sales Breakdown */}
          <div className="rounded-2xl border border-stitch-border bg-stitch-surface shadow-sm overflow-hidden">
            <div className="border-b border-stitch-border bg-stitch-canvas/70 px-5 py-3.5 font-bold text-xs text-stitch-typography flex items-center justify-between font-serif">
              <span>Rincian Kinerja Penjualan per Produk</span>
              <span className="text-[11px] font-normal text-stitch-muted font-sans">
                {report.ringkasan_produk ? report.ringkasan_produk.length : 0} item terdata
              </span>
            </div>
            {!report.ringkasan_produk || report.ringkasan_produk.length === 0 ? (
              <div className="p-8 text-center text-xs text-stitch-muted">
                Belum ada produk yang terjual dalam periode ini.
              </div>
            ) : (
              <div className="overflow-x-auto table-responsive">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="border-b border-stitch-border bg-stitch-border/40/60 font-semibold text-stitch-typography whitespace-nowrap">
                    <tr>
                      <th className="px-5 py-3">Nama Produk</th>
                      <th className="px-5 py-3">Kategori</th>
                      <th className="px-5 py-3 text-right">Unit Terjual</th>
                      <th className="px-5 py-3 text-right">Total Omzet</th>
                      <th className="px-5 py-3 text-right">Total HPP</th>
                      <th className="px-5 py-3 text-right">Total Laba</th>
                      <th className="px-5 py-3 text-right">Margin (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100 bg-stitch-surface">
                    {report.ringkasan_produk.map((p) => (
                      <tr key={p.product_id} className="hover:bg-stitch-canvas/50 transition-colors">
                        <td className="px-5 py-3 font-semibold text-stitch-typography whitespace-nowrap">{p.nama_produk}</td>
                        <td className="px-5 py-3 text-stitch-muted whitespace-nowrap">
                          <span className="rounded-lg bg-stitch-border/40/70 px-2 py-0.5 text-[11px] font-medium text-warm-800">
                            {p.kategori || "Umum"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-medium text-stitch-typography whitespace-nowrap">
                          {p.total_terjual}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-stitch-typography whitespace-nowrap">
                          {formatRupiah(p.total_omzet)}
                        </td>
                        <td className="px-5 py-3 text-right text-stitch-muted whitespace-nowrap">
                          {formatRupiah(p.total_hpp)}
                        </td>
                        <td className="px-5 py-3 text-right font-extrabold text-stitch-primary whitespace-nowrap">
                          {formatRupiah(p.total_laba)}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-stitch-typography whitespace-nowrap">
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
    </div>
  );
}

