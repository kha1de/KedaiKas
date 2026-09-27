"use client";

import React, { useEffect, useState } from "react";
import { targetService } from "@/services/target";
import { Target, TargetInput, TargetProgress } from "@/types/target";
import { formatRupiah, formatPercent, formatDate } from "@/lib/format";

const getTodayString = () => new Date().toISOString().split("T")[0];
const getEndOfMonthString = () => {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return end.toISOString().split("T")[0];
};

const defaultForm: TargetInput = {
  target_laba: 0,
  periode_mulai: getTodayString(),
  periode_selesai: getEndOfMonthString(),
};

export default function TargetPage() {
  const [progress, setProgress] = useState<TargetProgress | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal form
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Target | null>(null);
  const [form, setForm] = useState<TargetInput>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [progData, listData] = await Promise.all([
        targetService.getProgress(),
        targetService.getAll(),
      ]);
      setProgress(progData);
      setTargets(listData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat target laba.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditTarget(null);
    setForm({
      target_laba: 0,
      periode_mulai: getTodayString(),
      periode_selesai: getEndOfMonthString(),
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (t: Target) => {
    setEditTarget(t);
    setForm({
      target_laba: Number(t.target_laba),
      periode_mulai: t.periode_mulai.split("T")[0],
      periode_selesai: t.periode_selesai.split("T")[0],
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
    if (form.target_laba <= 0) {
      setFormError("Target laba harus lebih besar dari 0.");
      return;
    }
    if (form.periode_selesai < form.periode_mulai) {
      setFormError("Tanggal selesai harus sama atau setelah tanggal mulai.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      if (editTarget) {
        await targetService.update(editTarget.id, form);
      } else {
        await targetService.create(form);
      }
      handleCloseModal();
      await fetchData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan target laba.");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercentClamped = Math.min(
    Math.max(progress?.progress_persen ?? 0, 0),
    100
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stitch-border pb-5">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stitch-success-bg border border-stitch-primary/20 text-[11px] font-semibold text-stitch-primary mb-1.5">
            <span>🎯</span>
            <span>Target & Milestone Bisnis</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stitch-typography font-serif truncate">
            Target Laba Usaha
          </h1>
          <p className="text-xs sm:text-sm text-stitch-typography mt-0.5">
            Tetapkan target keuntungan berkala dan pantau laju pencapaian laba harian secara real-time
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-stitch-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-stitch-primary/90 transition-colors shadow-sm"
        >
          <span>+</span>
          <span>Pasang Target Baru</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-stitch-danger-bg bg-stitch-danger-bg/20/80 p-4 text-xs text-stitch-danger-text shadow-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button onClick={fetchData} className="font-semibold underline hover:text-red-900 ml-2">
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="rounded-2xl border border-stitch-border bg-stitch-surface p-12 text-center text-xs text-stitch-muted shadow-sm">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-forest-800 border-t-transparent mb-2"></div>
          <div>Memuat data target laba...</div>
        </div>
      ) : (
        <>
          {/* Active Target Progress Section */}
          {progress && progress.target ? (
            <div className="rounded-2xl border border-stitch-border bg-stitch-surface p-4 sm:p-6 shadow-sm space-y-5 min-w-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stitch-border/50 pb-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-block rounded-full bg-stitch-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-stitch-primary border border-stitch-primary/20">
                      TARGET AKTIF
                    </span>
                    <span className="text-xs text-stitch-muted">
                      Sisa waktu: <strong className="text-stitch-typography font-semibold">{progress.hari_tersisa} hari lagi</strong>
                    </span>
                  </div>
                  <div className="text-xs text-stitch-typography truncate">
                    Periode:{" "}
                    <span className="font-semibold text-stitch-typography">
                      {formatDate(progress.target.periode_mulai)}
                    </span>{" "}
                    s/d{" "}
                    <span className="font-semibold text-stitch-typography">
                      {formatDate(progress.target.periode_selesai)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => handleOpenEdit(progress.target!)}
                    className="min-h-[38px] rounded-xl border border-stitch-border bg-stitch-surface px-3.5 py-1.5 text-xs font-semibold text-stitch-typography hover:bg-stitch-canvas active:bg-stitch-border/40 transition-colors shadow-sm"
                  >
                    Ubah Target
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-baseline mb-2 text-xs">
                  <span className="font-semibold text-stitch-typography">Progres Pencapaian Target Laba</span>
                  <span className={`text-sm sm:text-base font-extrabold ${progress.progress_persen >= 100 ? "text-stitch-secondary" : "text-amber-700"}`}>
                    {formatPercent(progress.progress_persen)}
                  </span>
                </div>
                <div className="h-3.5 w-full rounded-full bg-stitch-border/40 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress.progress_persen >= 100 ? "bg-forest-600" : "bg-gradient-to-r from-amber-500 to-forest-600"
                    }`}
                    style={{ width: `${progressPercentClamped}%` }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4 pt-2">
                <div className="rounded-xl border border-stitch-border/60 bg-stitch-canvas/50 p-3 sm:p-4 min-w-0">
                  <div className="text-[11px] font-medium text-stitch-muted truncate">Target Laba Bersih</div>
                  <div className="mt-1 text-sm sm:text-base font-extrabold text-stitch-typography truncate">
                    {formatRupiah(progress.target_laba)}
                  </div>
                </div>

                <div className="rounded-xl border border-stitch-primary/20/60 bg-stitch-success-bg/40 p-3 sm:p-4 min-w-0">
                  <div className="text-[11px] font-medium text-stitch-secondary truncate">Laba Bersih Tercapai</div>
                  <div className="mt-1 text-sm sm:text-base font-extrabold text-stitch-primary truncate">
                    {formatRupiah(progress.laba_saat_ini)}
                  </div>
                </div>

                <div className="rounded-xl border border-stitch-border/60 bg-stitch-canvas/50 p-3 sm:p-4 min-w-0">
                  <div className="text-[11px] font-medium text-stitch-muted truncate">Kekurangan (Gap)</div>
                  <div className="mt-1 text-sm sm:text-base font-extrabold text-stitch-typography truncate">
                    {formatRupiah(progress.target_gap)}
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-3 sm:p-4 min-w-0">
                  <div className="text-[11px] font-medium text-amber-800 truncate">Kebutuhan Laba / Hari</div>
                  <div className="mt-1 text-sm sm:text-base font-extrabold text-amber-900 truncate">
                    {formatRupiah(progress.kebutuhan_laba_harian)}
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="rounded-xl border border-stitch-border bg-stitch-canvas/60 p-3.5 text-xs text-stitch-typography flex items-center gap-2">
                <span className="font-bold text-stitch-primary shrink-0">Catatan Sistem:</span>
                <span className="leading-relaxed">{progress.status}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-stitch-border bg-stitch-surface p-6 sm:p-10 text-center shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stitch-success-bg text-2xl text-stitch-primary mb-3">
                🎯
              </div>
              <p className="text-sm font-bold text-stitch-typography">Belum Ada Target Laba Aktif</p>
              <p className="mt-1.5 text-xs text-charcoal-600 max-w-md mx-auto">
                Pasang target keuntungan untuk membantu memotivasi penjualan dan memantau berapa laba harian yang harus dicapai agar bisnis tetap sehat.
              </p>
              <button
                onClick={handleOpenCreate}
                className="mt-5 min-h-[42px] rounded-xl bg-stitch-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-stitch-primary/90 transition-colors shadow-sm"
              >
                + Pasang Target Pertama
              </button>
            </div>
          )}

          {/* Target History Table */}
          <div className="rounded-2xl border border-stitch-border bg-stitch-surface shadow-sm overflow-hidden">
            <div className="border-b border-stitch-border bg-stitch-canvas/70 px-4 sm:px-5 py-3.5 font-bold text-xs text-stitch-typography flex items-center justify-between">
              <span>Riwayat Target Usaha</span>
              <span className="text-[11px] font-normal text-stitch-muted">{targets.length} target tercatat</span>
            </div>
            {targets.length === 0 ? (
              <div className="p-8 text-center text-xs text-stitch-muted">
                Belum ada riwayat target yang pernah dibuat.
              </div>
            ) : (
              <div className="overflow-x-auto table-responsive">
                <table className="w-full text-left text-xs min-w-[480px]">
                  <thead className="border-b border-stitch-border bg-stitch-border/40/50 font-semibold text-stitch-typography">
                    <tr>
                      <th className="px-4 sm:px-5 py-3 whitespace-nowrap">Periode Mulai</th>
                      <th className="px-4 sm:px-5 py-3 whitespace-nowrap">Periode Selesai</th>
                      <th className="px-4 sm:px-5 py-3 text-right whitespace-nowrap">Target Laba</th>
                      <th className="px-4 sm:px-5 py-3 text-center whitespace-nowrap">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100">
                    {targets.map((t) => (
                      <tr key={t.id} className="hover:bg-stitch-canvas/60 transition-colors">
                        <td className="px-4 sm:px-5 py-3 font-medium text-stitch-muted whitespace-nowrap">
                          {formatDate(t.periode_mulai)}
                        </td>
                        <td className="px-4 sm:px-5 py-3 font-medium text-stitch-muted whitespace-nowrap">
                          {formatDate(t.periode_selesai)}
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-right font-extrabold text-stitch-typography whitespace-nowrap">
                          {formatRupiah(t.target_laba)}
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="min-h-[32px] rounded-lg border border-stitch-border bg-stitch-surface px-3 py-1 text-xs font-semibold text-stitch-typography hover:bg-stitch-canvas active:bg-stitch-border/40 transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto my-auto rounded-2xl border border-stitch-border bg-stitch-surface p-4 sm:p-6 shadow-sm animate-slide-up">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stitch-border/50">
              <h2 className="text-base font-bold text-stitch-typography truncate pr-2">
                {editTarget ? "Edit Target Laba" : "Pasang Target Laba Baru"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="h-9 w-9 shrink-0 rounded-xl p-1 text-stitch-muted hover:bg-stitch-border/40 hover:text-stitch-typography flex items-center justify-center transition-colors"
                aria-label="Tutup Dialog"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-xl border border-stitch-danger-bg bg-stitch-danger-bg/20/80 p-3 text-xs text-stitch-danger-text flex items-center gap-2">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stitch-typography mb-1.5">
                  Target Laba Bersih (Rp) <span className="text-stitch-accent">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.target_laba || ""}
                  onChange={(e) => setForm({ ...form, target_laba: Number(e.target.value) })}
                  className="w-full min-h-[42px] rounded-xl border border-stitch-border px-3.5 py-2.5 text-xs sm:text-sm text-stitch-typography focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100"
                  placeholder="Contoh: 5000000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stitch-typography mb-1.5">
                    Periode Mulai <span className="text-stitch-accent">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.periode_mulai}
                    onChange={(e) => setForm({ ...form, periode_mulai: e.target.value })}
                    className="w-full min-h-[42px] rounded-xl border border-stitch-border px-3.5 py-2.5 text-xs sm:text-sm text-stitch-typography focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 bg-stitch-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stitch-typography mb-1.5">
                    Periode Selesai <span className="text-stitch-accent">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.periode_selesai}
                    onChange={(e) => setForm({ ...form, periode_selesai: e.target.value })}
                    className="w-full min-h-[42px] rounded-xl border border-stitch-border px-3.5 py-2.5 text-xs sm:text-sm text-stitch-typography focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 bg-stitch-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-3 border-t border-stitch-border/50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="w-full sm:w-auto min-h-[42px] rounded-xl border border-stitch-border bg-stitch-surface px-5 py-2.5 text-xs font-semibold text-stitch-typography hover:bg-stitch-canvas disabled:opacity-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 min-h-[42px] rounded-xl bg-stitch-primary py-2.5 px-4 text-xs font-semibold text-white hover:bg-stitch-primary/90 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {submitting ? "Menyimpan..." : editTarget ? "Perbarui Target" : "Pasang Target"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

