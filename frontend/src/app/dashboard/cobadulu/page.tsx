"use client";

import React, { useEffect, useState } from "react";
import { cobaduluService } from "@/services/cobadulu";
import { produkService } from "@/services/produk";
import { Product } from "@/types/produk";
import {
  SimulationRequest,
  SimulationResponse,
  SimulationProductInput,
} from "@/types/cobadulu";
import { formatRupiah, formatPercent } from "@/lib/format";

interface SimProductRow {
  product_id: number;
  nama_produk: string;
  satuan: string;
  current_harga_modal: number;
  current_harga_jual: number;
  harga_jual_baru: number;
  harga_modal_baru: number;
  jumlah_penjualan_baru: number;
}

export default function CobaDuluPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [simRows, setSimRows] = useState<SimProductRow[]>([]);
  const [pengeluaranBaru, setPengeluaranBaru] = useState<string>("");
  const [targetLabaSimulasi, setTargetLabaSimulasi] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResponse | null>(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const prods = await produkService.getAll();
      setProducts(prods);

      // Initialize simulation rows with current values
      const initialRows: SimProductRow[] = prods.map((p) => ({
        product_id: p.id,
        nama_produk: p.nama_produk,
        satuan: p.satuan,
        current_harga_modal: Number(p.harga_modal),
        current_harga_jual: Number(p.harga_jual),
        harga_jual_baru: Number(p.harga_jual),
        harga_modal_baru: Number(p.harga_modal),
        jumlah_penjualan_baru: 10,
      }));
      setSimRows(initialRows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat data produk untuk simulasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleRowChange = (index: number, field: keyof SimProductRow, value: number) => {
    const updated = [...simRows];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setSimRows(updated);
  };

  const handleReset = () => {
    const initialRows: SimProductRow[] = products.map((p) => ({
      product_id: p.id,
      nama_produk: p.nama_produk,
      satuan: p.satuan,
      current_harga_modal: Number(p.harga_modal),
      current_harga_jual: Number(p.harga_jual),
      harga_jual_baru: Number(p.harga_jual),
      harga_modal_baru: Number(p.harga_modal),
      jumlah_penjualan_baru: 10,
    }));
    setSimRows(initialRows);
    setPengeluaranBaru("");
    setTargetLabaSimulasi("");
    setResult(null);
    setError(null);
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    setError(null);

    try {
      const payloadProducts: SimulationProductInput[] = simRows.map((r) => ({
        product_id: r.product_id,
        nama_produk: r.nama_produk,
        harga_jual_baru: r.harga_jual_baru,
        harga_modal_baru: r.harga_modal_baru,
        jumlah_penjualan_baru: r.jumlah_penjualan_baru,
      }));

      const payload: SimulationRequest = {
        produk_simulasi: payloadProducts,
        pengeluaran_baru: pengeluaranBaru ? Number(pengeluaranBaru) : undefined,
        target_laba_simulasi: targetLabaSimulasi ? Number(targetLabaSimulasi) : undefined,
      };

      const res = await cobaduluService.runSimulation(payload);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menjalankan simulasi.");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stitch-border pb-5">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stitch-success-bg border border-stitch-primary/20 text-[11px] font-semibold text-stitch-primary mb-1.5">
            <span>🧪</span>
            <span>Simulasi & What-If Sandbox</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stitch-typography font-serif truncate">
            CobaDulu: Simulasi Bisnis
          </h1>
          <p className="text-xs sm:text-sm text-stitch-typography mt-0.5">
            Uji coba skenario perubahan harga jual, modal, target volume penjualan, atau biaya operasional tanpa mengubah data riil usaha Anda
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            disabled={simulating || loading}
            className="flex-1 sm:flex-none min-h-[42px] inline-flex items-center justify-center rounded-xl border border-stitch-border bg-stitch-surface px-4 py-2 text-xs font-semibold text-stitch-typography hover:bg-stitch-canvas active:bg-stitch-border/40 disabled:opacity-50 transition-colors shadow-sm whitespace-nowrap"
          >
            Reset Simulasi
          </button>
          <button
            type="button"
            onClick={handleRunSimulation}
            disabled={simulating || loading || simRows.length === 0}
            className="flex-1 sm:flex-none min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-stitch-primary px-4 py-2 text-xs font-semibold text-white hover:bg-stitch-primary/90 active:scale-[0.99] disabled:opacity-50 transition-all shadow-sm whitespace-nowrap"
          >
            <span>✨</span>
            <span>{simulating ? "Menghitung..." : "Jalankan Simulasi"}</span>
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="rounded-2xl border border-stitch-primary/20/80 bg-stitch-success-bg/50 p-4 text-xs text-forest-900 flex items-start gap-3 shadow-sm">
        <span className="text-base">💡</span>
        <div className="leading-relaxed">
          <strong className="font-semibold text-stitch-primary">Simulasi Aman (Stateless Sandbox):</strong> Hasil proyeksi dihitung murni secara simulatif di memori. Data transaksi penjualan nyata dan katalog produk toko Anda di database tidak akan terpengaruh.
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-stitch-danger-bg bg-stitch-danger-bg/20/80 p-4 text-xs text-stitch-danger-text shadow-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchInitialData()}
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
          <div>Menyiapkan data produk untuk simulasi...</div>
        </div>
      ) : simRows.length === 0 ? (
        <div className="rounded-2xl border border-stitch-border bg-stitch-surface p-10 text-center text-xs text-stitch-muted shadow-sm">
          Belum ada data produk untuk disimulasikan. Silakan tambahkan produk terlebih dahulu di menu Produk.
        </div>
      ) : (
        <div className="space-y-6">
          {/* SIMULATION RESULTS IF AVAILABLE */}
          {result && (
            <div className="rounded-2xl border border-stitch-primary/20/90 bg-stitch-surface p-4 sm:p-6 shadow-sm space-y-5 animate-slide-up min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stitch-border/50 pb-3.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-stitch-typography font-serif">Hasil Proyeksi Skenario Simulasi</h2>
                </div>
                <span className="self-start sm:self-auto rounded-full bg-stitch-primary/10 px-3 py-1 text-[11px] font-bold text-stitch-primary border border-stitch-primary/20">
                  ✓ Simulasi Selesai Dihitung
                </span>
              </div>

              {/* Highlight cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-stitch-border bg-stitch-canvas/50 p-4 min-w-0">
                  <div className="text-[11px] font-medium text-stitch-muted truncate">Proyeksi Laba Bersih</div>
                  <div className="text-lg sm:text-xl font-extrabold text-stitch-typography mt-1 truncate">
                    {formatRupiah(result.proyeksi_simulasi.laba_bersih)}
                  </div>
                  <div
                    className={`text-xs font-bold mt-1 inline-flex items-center gap-1 truncate ${
                      Number(result.selisih.laba_bersih_diff) >= 0
                        ? "text-stitch-secondary"
                        : "text-stitch-accent"
                    }`}
                  >
                    <span>{Number(result.selisih.laba_bersih_diff) >= 0 ? "▲" : "▼"}</span>
                    <span className="truncate">
                      {Number(result.selisih.laba_bersih_diff) >= 0 ? "+" : ""}
                      {formatRupiah(result.selisih.laba_bersih_diff)} vs saat ini
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-stitch-border bg-stitch-canvas/50 p-4 min-w-0">
                  <div className="text-[11px] font-medium text-stitch-muted truncate">Proyeksi Total Omzet</div>
                  <div className="text-lg sm:text-xl font-extrabold text-stitch-typography mt-1 truncate">
                    {formatRupiah(result.proyeksi_simulasi.omzet)}
                  </div>
                  <div
                    className={`text-xs font-bold mt-1 inline-flex items-center gap-1 truncate ${
                      Number(result.selisih.omzet_diff) >= 0
                        ? "text-stitch-secondary"
                        : "text-stitch-accent"
                    }`}
                  >
                    <span>{Number(result.selisih.omzet_diff) >= 0 ? "▲" : "▼"}</span>
                    <span className="truncate">
                      {Number(result.selisih.omzet_diff) >= 0 ? "+" : ""}
                      {formatRupiah(result.selisih.omzet_diff)} vs saat ini
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-stitch-border bg-stitch-canvas/50 p-4 min-w-0">
                  <div className="text-[11px] font-medium text-stitch-muted truncate">Proyeksi Margin Laba (%)</div>
                  <div className="text-lg sm:text-xl font-extrabold text-stitch-typography mt-1 truncate">
                    {formatPercent(result.proyeksi_simulasi.margin_persen)}
                  </div>
                  <div
                    className={`text-xs font-bold mt-1 inline-flex items-center gap-1 truncate ${
                      result.selisih.margin_diff_persen >= 0
                        ? "text-stitch-secondary"
                        : "text-stitch-accent"
                    }`}
                  >
                    <span>{result.selisih.margin_diff_persen >= 0 ? "▲" : "▼"}</span>
                    <span className="truncate">
                      {result.selisih.margin_diff_persen >= 0 ? "+" : ""}
                      {formatPercent(result.selisih.margin_diff_persen)} poin
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Comparison Table */}
              <div className="overflow-x-auto table-responsive rounded-xl border border-stitch-border">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="border-b border-stitch-border bg-stitch-border/40/60 font-semibold text-stitch-typography">
                    <tr>
                      <th className="px-4 py-3 whitespace-nowrap">Metrik Keuangan</th>
                      <th className="px-4 py-3 text-right whitespace-nowrap">Kondisi Saat Ini</th>
                      <th className="px-4 py-3 text-right whitespace-nowrap">Proyeksi Skenario</th>
                      <th className="px-4 py-3 text-right whitespace-nowrap">Selisih (Dampak)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100 bg-stitch-surface">
                    <tr className="hover:bg-stitch-canvas/50">
                      <td className="px-4 py-2.5 font-medium text-stitch-typography whitespace-nowrap">Total Omzet Penjualan</td>
                      <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                        {formatRupiah(result.saat_ini.omzet)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-stitch-typography whitespace-nowrap">
                        {formatRupiah(result.proyeksi_simulasi.omzet)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-stitch-typography whitespace-nowrap">
                        {formatRupiah(result.selisih.omzet_diff)}
                      </td>
                    </tr>
                    <tr className="hover:bg-stitch-canvas/50">
                      <td className="px-4 py-2.5 font-medium text-stitch-typography whitespace-nowrap">Harga Pokok Penjualan (HPP)</td>
                      <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                        {formatRupiah(result.saat_ini.hpp)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-stitch-typography whitespace-nowrap">
                        {formatRupiah(result.proyeksi_simulasi.hpp)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-stitch-typography whitespace-nowrap">
                        {formatRupiah(result.selisih.hpp_diff)}
                      </td>
                    </tr>
                    <tr className="hover:bg-stitch-canvas/50">
                      <td className="px-4 py-2.5 font-medium text-stitch-typography whitespace-nowrap">Laba Kotor</td>
                      <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                        {formatRupiah(result.saat_ini.laba_kotor)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-stitch-typography whitespace-nowrap">
                        {formatRupiah(result.proyeksi_simulasi.laba_kotor)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-stitch-typography whitespace-nowrap">
                        {formatRupiah(
                          Number(result.proyeksi_simulasi.laba_kotor) -
                            Number(result.saat_ini.laba_kotor)
                        )}
                      </td>
                    </tr>
                    <tr className="hover:bg-stitch-canvas/50">
                      <td className="px-4 py-2.5 font-medium text-stitch-typography whitespace-nowrap">Beban Pengeluaran Usaha</td>
                      <td className="px-4 py-2.5 text-right text-stitch-muted whitespace-nowrap">
                        {formatRupiah(result.saat_ini.pengeluaran)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-stitch-typography whitespace-nowrap">
                        {formatRupiah(result.proyeksi_simulasi.pengeluaran)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-stitch-typography whitespace-nowrap">
                        {formatRupiah(result.selisih.pengeluaran_diff)}
                      </td>
                    </tr>
                    <tr className="bg-stitch-success-bg/40">
                      <td className="px-4 py-3 font-bold text-stitch-typography whitespace-nowrap">Laba Bersih Akhir</td>
                      <td className="px-4 py-3 text-right font-medium text-warm-700 whitespace-nowrap">
                        {formatRupiah(result.saat_ini.laba_bersih)}
                      </td>
                      <td className="px-4 py-3 text-right font-extrabold text-stitch-primary text-sm whitespace-nowrap">
                        {formatRupiah(result.proyeksi_simulasi.laba_bersih)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-extrabold whitespace-nowrap ${
                          Number(result.selisih.laba_bersih_diff) >= 0
                            ? "text-stitch-secondary"
                            : "text-stitch-accent"
                        }`}
                      >
                        {Number(result.selisih.laba_bersih_diff) >= 0 ? "+" : ""}
                        {formatRupiah(result.selisih.laba_bersih_diff)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Target Comparison */}
              {result.perbandingan_target && Number(result.perbandingan_target.target_laba) > 0 && (
                <div className="rounded-xl border border-stitch-border bg-stitch-canvas/60 p-4 text-xs space-y-1">
                  <div className="font-bold text-stitch-typography">
                    Dampak Terhadap Target Laba ({formatRupiah(result.perbandingan_target.target_laba)})
                  </div>
                  <div className="text-stitch-typography">
                    {result.perbandingan_target.status_proyeksi}
                  </div>
                  <div className="text-[11px] text-stitch-muted">
                    Gap sisa target saat ini: {formatRupiah(result.perbandingan_target.gap_saat_ini)} → Skenario: {formatRupiah(result.perbandingan_target.gap_proyeksi)}
                  </div>
                </div>
              )}

              {/* Simulation Note / Recommendation */}
              {result.catatan && (
                <div className="rounded-xl border border-stitch-primary/20 bg-stitch-success-bg/60 p-4 text-xs text-stitch-typography">
                  <span className="font-bold text-forest-900">Insight Skenario: </span>
                  {result.catatan}
                </div>
              )}
            </div>
          )}

          {/* SIMULATION INPUTS FORM */}
          <div className="rounded-2xl border border-stitch-border bg-stitch-surface p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-stitch-typography font-serif">Parameter Skenario Simulasi</h2>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Sesuaikan nilai simulasi untuk biaya operasional dan parameter setiap produk di bawah ini
              </p>
            </div>

            {/* Global Overrides */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-xl border border-stitch-border bg-stitch-canvas/60 p-4 text-xs">
              <div>
                <label className="block font-semibold text-stitch-typography mb-1.5">
                  Simulasi Total Beban Pengeluaran (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  value={pengeluaranBaru}
                  onChange={(e) => setPengeluaranBaru(e.target.value)}
                  placeholder="Kosongkan untuk memakai pengeluaran saat ini"
                  className="w-full rounded-xl border border-stitch-border px-3 py-2 text-xs text-stitch-typography focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 bg-stitch-surface"
                />
              </div>

              <div>
                <label className="block font-semibold text-stitch-typography mb-1.5">
                  Target Laba Pembanding (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  value={targetLabaSimulasi}
                  onChange={(e) => setTargetLabaSimulasi(e.target.value)}
                  placeholder="Kosongkan untuk memakai target laba aktif"
                  className="w-full rounded-xl border border-stitch-border px-3 py-2 text-xs text-stitch-typography focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 bg-stitch-surface"
                />
              </div>
            </div>

            {/* Product Simulation Table */}
            <div>
              <div className="mb-3 text-xs font-bold text-stitch-typography">
                Ubah Harga atau Target Volume per Produk:
              </div>
              <div className="overflow-x-auto table-responsive rounded-xl border border-stitch-border">
                <table className="w-full min-w-[620px] text-left text-xs">
                  <thead className="border-b border-stitch-border bg-stitch-border/40/60 font-semibold text-stitch-typography whitespace-nowrap">
                    <tr>
                      <th className="px-4 py-3 min-w-[160px]">Nama Produk</th>
                      <th className="px-4 py-3">Harga Modal Baru (Rp)</th>
                      <th className="px-4 py-3">Harga Jual Baru (Rp)</th>
                      <th className="px-4 py-3">Target Volume ({`Unit`})</th>
                      <th className="px-4 py-3 text-right">Estimasi Omzet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100 bg-stitch-surface">
                    {simRows.map((row, idx) => {
                      const estOmzet = row.harga_jual_baru * row.jumlah_penjualan_baru;
                      return (
                        <tr key={row.product_id} className="hover:bg-stitch-canvas/50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-stitch-typography">
                            <div>{row.nama_produk}</div>
                            <div className="text-[11px] font-normal text-stitch-muted mt-0.5 whitespace-nowrap">
                              Saat ini: Jual {formatRupiah(row.current_harga_jual)} / Modal {formatRupiah(row.current_harga_modal)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              min={0}
                              value={row.harga_modal_baru}
                              onChange={(e) =>
                                handleRowChange(idx, "harga_modal_baru", Number(e.target.value))
                              }
                              className="w-32 rounded-xl border border-stitch-border px-2.5 py-2 min-h-[38px] text-xs text-stitch-typography focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 bg-stitch-surface"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              min={0}
                              value={row.harga_jual_baru}
                              onChange={(e) =>
                                handleRowChange(idx, "harga_jual_baru", Number(e.target.value))
                              }
                              className="w-32 rounded-xl border border-stitch-border px-2.5 py-2 min-h-[38px] text-xs text-stitch-typography focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 bg-stitch-surface"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              min={0}
                              value={row.jumlah_penjualan_baru}
                              onChange={(e) =>
                                handleRowChange(idx, "jumlah_penjualan_baru", Number(e.target.value))
                              }
                              className="w-24 rounded-xl border border-stitch-border px-2.5 py-2 min-h-[38px] text-xs text-stitch-typography focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 bg-stitch-surface"
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-extrabold text-stitch-typography whitespace-nowrap">
                            {formatRupiah(estOmzet)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-stitch-border/50">
              <button
                type="button"
                onClick={handleReset}
                disabled={simulating}
                className="w-full sm:w-auto min-h-[42px] flex items-center justify-center rounded-xl border border-stitch-border bg-stitch-surface px-4 py-2 text-xs font-semibold text-stitch-typography hover:bg-stitch-canvas transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={simulating}
                className="w-full sm:w-auto min-h-[42px] flex items-center justify-center rounded-xl bg-stitch-primary px-5 py-2 text-xs font-semibold text-white hover:bg-stitch-primary/90 disabled:opacity-50 transition-colors shadow-sm"
              >
                {simulating ? "Menghitung..." : "Jalankan Simulasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

