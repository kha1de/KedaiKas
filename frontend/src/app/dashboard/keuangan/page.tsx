"use client";

import React, { useEffect, useState } from "react";
import { keuanganService } from "@/services/keuangan";
import { Expense, ExpenseInput } from "@/types/keuangan";
import { formatRupiah, formatDate } from "@/lib/format";
import { Wallet, Plus, TrendingDown, Layers, CheckSquare, Search, Filter, Trash2, Edit, X, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

const CATEGORIES = [
  "Bahan Baku",
  "Operasional",
  "Gaji Karyawan",
  "Sewa Tempat",
  "Listrik & Air",
  "Pemasaran",
  "Lain-lain",
];

const getTodayString = () => new Date().toISOString().split("T")[0];

const defaultForm: ExpenseInput = {
  tanggal: getTodayString(),
  kategori: CATEGORIES[0],
  nominal: 0,
  keterangan: "",
};

export default function KeuanganPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [form, setForm] = useState<ExpenseInput>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchExpenses = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await keuanganService.getAll(start || undefined, end || undefined);
      setExpenses(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat catatan keuangan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(startDate, endDate);
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExpenses(startDate, endDate);
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchExpenses();
  };

  const handleOpenCreate = () => {
    setEditTarget(null);
    setForm({
      ...defaultForm,
      tanggal: getTodayString(),
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (exp: Expense) => {
    setEditTarget(exp);
    setForm({
      tanggal: exp.tanggal.split("T")[0],
      kategori: exp.kategori,
      nominal: Number(exp.nominal),
      keterangan: exp.keterangan || "",
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nominal <= 0) {
      setFormError("Nominal pengeluaran harus lebih besar dari 0.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      if (editTarget) {
        await keuanganService.update(editTarget.id, form);
      } else {
        await keuanganService.create(form);
      }
      handleCloseModal();
      await fetchExpenses(startDate, endDate);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan pengeluaran.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, kategori: string, nominal: number | string) => {
    if (!confirm(`Hapus pengeluaran ${kategori} sebesar ${formatRupiah(nominal)}?`)) return;
    try {
      await keuanganService.delete(id);
      await fetchExpenses(startDate, endDate);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus pengeluaran.");
    }
  };

  const totalPengeluaran = expenses.reduce((sum, item) => sum + Number(item.nominal), 0);

  // Group by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.kategori] = (acc[exp.kategori] || 0) + Number(exp.nominal);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-stitch-secondary/10 border border-stitch-secondary/20 mb-3">
            <Wallet className="h-3 w-3 text-stitch-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stitch-secondary">
              Manajemen Biaya & Beban Usaha
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stitch-typography mb-1">
            Catatan Keuangan
          </h1>
          <p className="text-stitch-muted text-sm">
            Pantau dan kendalikan pos pengeluaran operasional agar laba bersih tetap optimal.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stitch-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stitch-primary/90 transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>Catat Pengeluaran Baru</span>
        </button>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-stitch-surface p-5 rounded-2xl border border-stitch-border shadow-sm flex items-center justify-between overflow-hidden relative">
           <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-stitch-accent/10 pointer-events-none"></div>
           <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stitch-muted mb-1">Total Biaya Operasional</div>
            <div className="text-2xl font-bold text-stitch-accent tracking-tight">{formatRupiah(totalPengeluaran)}</div>
            <div className="text-[11px] text-stitch-muted mt-1">{expenses.length} bukti pengeluaran tercatat</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stitch-accent/10 text-stitch-accent flex items-center justify-center shrink-0">
             <TrendingDown className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-stitch-surface p-5 rounded-2xl border border-stitch-border shadow-sm flex items-center justify-between">
           <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stitch-muted mb-1">Kategori Pengeluaran Terbesar</div>
            <div className="text-lg font-bold text-stitch-typography truncate max-w-[160px]">
              {Object.keys(categoryTotals).length > 0
                ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
                : "-"}
            </div>
            <div className="text-sm font-semibold text-stitch-primary mt-0.5 truncate">
              {Object.keys(categoryTotals).length > 0
                ? formatRupiah(Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][1])
                : "Rp 0"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stitch-primary/10 text-stitch-primary flex items-center justify-center shrink-0">
             <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-stitch-surface p-5 rounded-2xl border border-stitch-border shadow-sm flex items-center justify-between">
           <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stitch-muted mb-1">Ragam Kategori Beban</div>
            <div className="text-2xl font-bold text-stitch-typography tracking-tight">{Object.keys(categoryTotals).length} Pos</div>
            <div className="text-[11px] text-stitch-muted mt-1">Bahan baku, sewa, listrik, dsb.</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stitch-canvas border border-stitch-border text-stitch-muted flex items-center justify-center shrink-0">
             <Layers className="h-5 w-5" />
          </div>
        </div>
      </section>

      {/* Category Breakdown Chips */}
      {Object.keys(categoryTotals).length > 0 && (
        <section className="bg-stitch-canvas/50 p-5 rounded-2xl border border-stitch-border/50">
          <div className="text-xs font-bold text-stitch-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Distribusi Pengeluaran Berdasarkan Pos
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(categoryTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, total]) => (
                <div key={cat} className="rounded-xl border border-stitch-border bg-stitch-surface p-3 text-center shadow-sm">
                  <div className="text-xs font-semibold text-stitch-muted truncate">{cat}</div>
                  <div className="text-sm font-bold text-stitch-primary mt-1 truncate">{formatRupiah(total)}</div>
                  <div className="text-[10px] font-medium text-stitch-secondary bg-stitch-secondary/10 inline-block px-1.5 py-0.5 rounded mt-1">
                    {totalPengeluaran > 0 ? `${((total / totalPengeluaran) * 100).toFixed(0)}%` : "0%"}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="bg-stitch-surface rounded-2xl shadow-sm border border-stitch-border overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-stitch-border bg-stitch-canvas/30">
          <form
            onSubmit={handleFilterSubmit}
            className="flex flex-col sm:flex-row items-end gap-4"
          >
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-semibold text-stitch-muted mb-1.5 uppercase tracking-wider">Dari Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stitch-border bg-stitch-surface text-sm text-stitch-typography focus:border-stitch-secondary outline-none transition-colors"
              />
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-semibold text-stitch-muted mb-1.5 uppercase tracking-wider">Sampai Tanggal</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stitch-border bg-stitch-surface text-sm text-stitch-typography focus:border-stitch-secondary outline-none transition-colors"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-stitch-primary text-white text-sm font-semibold hover:bg-stitch-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Saring Data</span>
              </button>
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stitch-border bg-stitch-surface text-stitch-muted text-sm font-semibold hover:bg-stitch-canvas transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error state */}
        {error && (
          <div className="m-4 flex items-center justify-between rounded-xl border border-stitch-danger-bg bg-stitch-danger-bg/20 p-4 text-sm text-stitch-danger-text">
            <span>{error}</span>
            <button
              onClick={() => fetchExpenses(startDate, endDate)}
              className="font-semibold underline hover:text-stitch-danger-text/80 ml-2"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Table List */}
        {loading ? (
          <div className="py-16 text-center text-sm font-medium text-stitch-muted">
            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-stitch-primary border-t-transparent" />
            Memuat catatan pengeluaran...
          </div>
        ) : expenses.length === 0 ? (
          <div className="py-16 text-center">
            <Wallet className="h-12 w-12 text-stitch-muted mx-auto mb-3 opacity-30" />
            <h3 className="text-base font-bold text-stitch-typography mb-1">Belum Ada Catatan Pengeluaran</h3>
            <p className="text-sm text-stitch-muted max-w-sm mx-auto mb-5">
              Catat biaya seperti belanja bahan baku, listrik, sewa tempat, atau gaji untuk melihat total beban usaha Anda.
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-stitch-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-stitch-primary/90 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Pengeluaran Pertama</span>
            </button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-stitch-canvas border-b border-stitch-border text-stitch-muted text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-4">Tanggal</th>
                  <th className="px-5 py-4">Pos Pengeluaran</th>
                  <th className="px-5 py-4">Keterangan</th>
                  <th className="px-5 py-4 text-right">Nominal Biaya</th>
                  <th className="px-5 py-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stitch-border/50 text-sm">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-stitch-canvas/30 transition-colors group">
                    <td className="px-5 py-4 text-stitch-typography font-medium">
                      {formatDate(exp.tanggal)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-stitch-canvas border border-stitch-border text-xs font-semibold text-stitch-muted">
                        {exp.kategori}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stitch-muted max-w-xs break-words">
                      {exp.keterangan || "-"}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-stitch-accent">
                      {formatRupiah(exp.nominal)}
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(exp)}
                            className="p-2 rounded-lg text-stitch-secondary hover:bg-stitch-secondary/10 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id, exp.kategori, exp.nominal)}
                            className="p-2 rounded-lg text-stitch-danger-text hover:bg-stitch-danger-bg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stitch-typography/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-stitch-surface rounded-3xl border border-stitch-border shadow-lg my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-stitch-border/50 sticky top-0 bg-stitch-surface/95 backdrop-blur-md z-10">
              <div>
                <h2 className="text-lg font-bold text-stitch-primary">
                  {editTarget ? "Edit Catatan Pengeluaran" : "Tambah Pengeluaran Baru"}
                </h2>
                <p className="text-xs text-stitch-muted mt-1">Catat semua biaya operasional & beban</p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="h-9 w-9 shrink-0 rounded-xl text-stitch-muted hover:bg-stitch-border/50 flex items-center justify-center transition-colors"
                aria-label="Tutup Dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {formError && (
                <div className="mb-6 rounded-xl bg-stitch-danger-bg/40 p-4 text-sm text-stitch-danger-text border border-stitch-danger-text/20 flex items-center gap-3 font-medium">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stitch-typography mb-1.5">
                    Tanggal Transaksi <span className="text-stitch-danger-text">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stitch-border bg-stitch-surface text-sm text-stitch-typography focus:border-stitch-secondary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stitch-typography mb-1.5">
                    Pos Kategori <span className="text-stitch-danger-text">*</span>
                  </label>
                  <select
                    required
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stitch-border bg-stitch-surface text-sm text-stitch-typography focus:border-stitch-secondary outline-none transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stitch-typography mb-1.5">
                    Nominal Biaya (Rp) <span className="text-stitch-danger-text">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.nominal || ""}
                    onChange={(e) => setForm({ ...form, nominal: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-stitch-border bg-stitch-surface text-sm font-bold text-stitch-typography focus:border-stitch-secondary outline-none transition-colors"
                    placeholder="Contoh: 150000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stitch-typography mb-1.5">
                    Keterangan / Catatan Tambahan
                  </label>
                  <textarea
                    rows={2}
                    value={form.keterangan || ""}
                    onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stitch-border bg-stitch-surface text-sm text-stitch-typography focus:border-stitch-secondary outline-none transition-colors resize-none"
                    placeholder="Contoh: Belanja beras & minyak di pasar induk"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-stitch-border/50">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="w-full sm:w-auto min-h-[46px] rounded-xl border border-stitch-border bg-stitch-surface px-6 py-2.5 text-sm font-semibold text-stitch-typography hover:bg-stitch-canvas transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 min-h-[46px] rounded-xl bg-stitch-primary px-6 text-sm font-bold text-white shadow-sm hover:bg-stitch-primary/90 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                       <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Menyimpan...
                      </span>
                    ) : (
                       editTarget ? "Perbarui Pengeluaran" : "Simpan Pengeluaran"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
