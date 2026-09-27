"use client";

import React, { useEffect, useState } from "react";
import { produkService } from "@/services/produk";
import { Product, ProductInput } from "@/types/produk";
import { formatRupiah, formatPercent } from "@/lib/format";
import { PackageOpen, Plus, Search, Filter, Edit, Trash2, X, TrendingUp, TrendingDown, AlertTriangle, Box, Percent } from "lucide-react";

const emptyForm: ProductInput = {
  nama_produk: "",
  kategori: "",
  harga_modal: 0,
  harga_jual: 0,
  satuan: "",
};

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await produkService.getAll();
      setProducts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat data produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditTarget(p);
    setForm({
      nama_produk: p.nama_produk,
      kategori: p.kategori ?? "",
      harga_modal: Number(p.harga_modal),
      harga_jual: Number(p.harga_jual),
      satuan: p.satuan,
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditTarget(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (editTarget) {
        await produkService.update(editTarget.id, form);
      } else {
        await produkService.create(form);
      }
      setShowForm(false);
      setEditTarget(null);
      await fetchProducts();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan produk.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus produk "${nama}"? Aksi ini tidak dapat dibatalkan.`)) return;
    try {
      await produkService.delete(id);
      await fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus produk.");
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.kategori).filter(Boolean))) as string[]];

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.kategori && p.kategori.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategory === "Semua" || p.kategori === selectedCategory;
    return matchSearch && matchCat;
  });

  const avgMargin = products.length > 0
    ? products.reduce((sum, p) => sum + (Number(p.margin_persen) || 0), 0) / products.length
    : 0;

  const healthyProductsCount = products.filter((p) => Number(p.margin_persen) >= 30).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-stitch-secondary/10 border border-stitch-secondary/20 mb-3">
            <PackageOpen className="h-3 w-3 text-stitch-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stitch-secondary">
              Katalog & Manajemen Harga
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stitch-typography mb-1">
            Daftar Produk Warung
          </h1>
          <p className="text-stitch-muted text-sm">
            Kelola harga modal (HPP), harga jual, dan evaluasi margin laba per item barang.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stitch-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stitch-primary/90 transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </section>

      {/* Quick Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stitch-surface p-5 rounded-2xl border border-stitch-border shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-stitch-primary/10 text-stitch-primary flex items-center justify-center shrink-0">
             <Box className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stitch-muted mb-0.5">Total Item Produk</div>
            <div className="text-2xl font-bold text-stitch-typography truncate">{products.length} SKU</div>
          </div>
        </div>
        
        <div className="bg-stitch-surface p-5 rounded-2xl border border-stitch-border shadow-sm flex items-center gap-4">
           <div className="h-12 w-12 rounded-xl bg-stitch-secondary/10 text-stitch-secondary flex items-center justify-center shrink-0">
             <Percent className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stitch-muted mb-0.5">Rata-rata Margin</div>
            <div className="text-2xl font-bold text-stitch-secondary truncate">{formatPercent(avgMargin)}</div>
          </div>
        </div>
        
        <div className="bg-stitch-surface p-5 rounded-2xl border border-stitch-border shadow-sm flex items-center gap-4">
           <div className="h-12 w-12 rounded-xl bg-stitch-success-bg text-stitch-success-text flex items-center justify-center shrink-0 border border-stitch-success-text/20">
             <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stitch-muted mb-0.5">Margin Sehat (&ge;30%)</div>
            <div className="text-2xl font-bold text-stitch-primary truncate">
              {healthyProductsCount} <span className="text-sm font-medium text-stitch-muted">Produk</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-stitch-surface rounded-2xl shadow-sm border border-stitch-border overflow-hidden flex flex-col">
        {/* Toolbar: Filters & Search */}
        <div className="p-4 sm:p-5 border-b border-stitch-border/60 bg-stitch-canvas/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? "bg-stitch-primary text-white shadow-sm"
                      : "bg-stitch-canvas text-stitch-muted hover:bg-stitch-border/50 hover:text-stitch-typography"
                  }`}
                >
                  {cat} {cat !== "Semua" && `(${products.filter(p => p.kategori === cat).length})`}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stitch-muted h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau kategori..."
              className="w-full pl-9 pr-4 py-2.5 bg-stitch-surface border border-stitch-border rounded-xl text-sm text-stitch-typography placeholder-stitch-muted focus:outline-none focus:border-stitch-secondary transition-colors"
            />
          </div>
        </div>

        {/* States: Loading, Error, Empty, Data Table */}
        {loading && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-stitch-primary border-t-transparent" />
            <div className="text-sm font-medium text-stitch-muted">Memuat katalog produk...</div>
          </div>
        )}

        {error && (
          <div className="m-5 rounded-xl border border-stitch-danger-bg bg-stitch-danger-bg/30 p-4 text-sm text-stitch-danger-text text-center font-medium">
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="py-16 text-center">
            <Box className="h-12 w-12 text-stitch-muted mx-auto mb-3 opacity-30" />
            <div className="text-base font-bold text-stitch-typography mb-1">Tidak Ada Produk</div>
            <p className="text-sm text-stitch-muted max-w-sm mx-auto">
              {searchQuery ? "Coba kata kunci pencarian lain atau ganti filter kategori." : "Belum ada produk yang ditambahkan ke katalog."}
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-stitch-canvas border-b border-stitch-border text-stitch-muted text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-4">Produk & Menu</th>
                  <th className="px-5 py-4">Kategori</th>
                  <th className="px-5 py-4 text-right">Harga Modal</th>
                  <th className="px-5 py-4 text-right">Harga Jual</th>
                  <th className="px-5 py-4 text-center">Margin Keuntungan</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stitch-border/50 text-sm">
                {filteredProducts.map((p) => {
                  const profitUnit = Number(p.harga_jual) - Number(p.harga_modal);
                  const isHealthy = Number(p.margin_persen) >= 30;
                  return (
                    <tr key={p.id} className="hover:bg-stitch-canvas/30 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-stitch-typography group-hover:text-stitch-primary transition-colors mb-0.5">
                          {p.nama_produk}
                        </div>
                        <div className="text-xs text-stitch-muted">
                           Satuan: {p.satuan}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-stitch-canvas border border-stitch-border text-xs font-medium text-stitch-muted">
                          {p.kategori ?? "Umum"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="font-medium text-stitch-muted">{formatRupiah(p.harga_modal)}</div>
                      </td>
                      <td className="px-5 py-4 text-right">
                         <div className="font-bold text-stitch-typography">{formatRupiah(p.harga_jual)}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isHealthy ? "bg-stitch-success-bg text-stitch-success-text border-stitch-success-text/20" : "bg-stitch-pending-bg text-stitch-pending-text border-stitch-pending-text/20"
                          }`}>
                            {isHealthy ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {formatPercent(p.margin_persen)}
                          </span>
                          <span className="text-[11px] font-medium text-stitch-muted mt-1">
                             Laba: {formatRupiah(profitUnit)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 rounded-lg text-stitch-secondary hover:bg-stitch-secondary/10 transition-colors"
                            title="Edit Produk"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.nama_produk)}
                            className="p-2 rounded-lg text-stitch-danger-text hover:bg-stitch-danger-bg transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stitch-typography/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-stitch-surface rounded-3xl border border-stitch-border shadow-lg my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-stitch-border/50 sticky top-0 bg-stitch-surface/95 backdrop-blur-md z-10">
              <div>
                <h2 className="text-lg font-bold text-stitch-primary">
                  {editTarget ? "Perbarui Produk" : "Tambah Produk Baru"}
                </h2>
                <p className="text-xs text-stitch-muted mt-1">Lengkapi data barang dan modal</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
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
                  <label className="block text-sm font-semibold text-stitch-typography mb-1.5">Nama Produk <span className="text-stitch-danger-text">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.nama_produk}
                    onChange={(e) => setForm({ ...form, nama_produk: e.target.value })}
                    placeholder="Contoh: Kopi Susu Gula Aren"
                    className="w-full px-4 py-3 rounded-xl border border-stitch-border bg-stitch-surface text-sm text-stitch-typography focus:border-stitch-secondary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stitch-typography mb-1.5">Kategori Barang</label>
                  <input
                    type="text"
                    value={form.kategori ?? ""}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stitch-border bg-stitch-surface text-sm text-stitch-typography focus:border-stitch-secondary outline-none transition-colors"
                    placeholder="Contoh: Minuman, Makanan, Sembako"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stitch-typography mb-1.5">Harga Modal (Rp) <span className="text-stitch-danger-text">*</span></label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={form.harga_modal}
                      onChange={(e) => setForm({ ...form, harga_modal: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-stitch-border bg-stitch-surface text-sm font-bold text-stitch-typography focus:border-stitch-secondary outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stitch-typography mb-1.5">Harga Jual (Rp) <span className="text-stitch-danger-text">*</span></label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={form.harga_jual}
                      onChange={(e) => setForm({ ...form, harga_jual: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-stitch-border bg-stitch-surface text-sm font-bold text-stitch-typography focus:border-stitch-secondary outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stitch-typography mb-1.5">Satuan Penjualan <span className="text-stitch-danger-text">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.satuan}
                    onChange={(e) => setForm({ ...form, satuan: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stitch-border bg-stitch-surface text-sm text-stitch-typography focus:border-stitch-secondary outline-none transition-colors"
                    placeholder="Contoh: cup, bungkus, porsi, kg"
                  />
                </div>

                {/* Preview Margin Pill */}
                {form.harga_jual > 0 && (
                  <div className="rounded-xl bg-stitch-canvas border border-stitch-border p-4 text-sm flex items-center justify-between gap-2 mt-2">
                    <span className="text-stitch-muted font-medium">Estimasi Laba per Unit:</span>
                    <span
                      className={`font-bold ${
                        ((form.harga_jual - form.harga_modal) / form.harga_jual) * 100 >= 30
                          ? "text-stitch-success-text"
                          : "text-stitch-warning"
                      }`}
                    >
                      {formatRupiah(form.harga_jual - form.harga_modal)}
                      <span className="opacity-80 text-xs ml-1">
                         ({formatPercent(((form.harga_jual - form.harga_modal) / form.harga_jual) * 100)})
                      </span>
                    </span>
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-stitch-border/50">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto min-h-[46px] rounded-xl border border-stitch-border bg-stitch-surface px-6 py-2.5 text-sm font-semibold text-stitch-typography hover:bg-stitch-canvas transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 min-h-[46px] rounded-xl bg-stitch-primary px-6 text-sm font-bold text-white shadow-sm hover:bg-stitch-primary/90 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Menyimpan...
                      </span>
                    ) : (
                       editTarget ? "Simpan Perubahan" : "Tambah Produk"
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
