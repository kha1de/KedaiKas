"use client";

import React, { useEffect, useState } from "react";
import { transaksiService } from "@/services/transaksi";
import { produkService } from "@/services/produk";
import { Transaction, TransactionItemInput } from "@/types/transaksi";
import { Product } from "@/types/produk";
import { formatRupiah, formatDate } from "@/lib/format";
import { Receipt, Search, ShoppingCart, Trash2, X, Tag, PackageOpen, LayoutGrid, CheckCircle, AlertTriangle } from "lucide-react";

interface CartItem {
  product_id: number;
  nama_produk: string;
  harga_jual: number;
  jumlah: number;
}

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [txData, prodData] = await Promise.all([
        transaksiService.getAll(),
        produkService.getAll(),
      ]);
      setTransactions(txData);
      setProducts(prodData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat data transaksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenForm = () => {
    setCart([]);
    setSelectedProductId(products[0]?.id ?? 0);
    setQty(1);
    setFormError(null);
    setShowForm(true);
  };

  const handleAddToCart = () => {
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;
    const existing = cart.find((c) => c.product_id === selectedProductId);
    if (existing) {
      setCart(cart.map((c) =>
        c.product_id === selectedProductId ? { ...c, jumlah: c.jumlah + qty } : c
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        nama_produk: product.nama_produk,
        harga_jual: Number(product.harga_jual),
        jumlah: qty,
      }]);
    }
    setQty(1);
  };

  const handleRemoveFromCart = (product_id: number) => {
    setCart(cart.filter((c) => c.product_id !== product_id));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.harga_jual * c.jumlah, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setFormError("Tambahkan setidaknya 1 produk ke keranjang.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const items: TransactionItemInput[] = cart.map((c) => ({
        product_id: c.product_id,
        jumlah: c.jumlah,
      }));
      await transaksiService.create({ items });
      setShowForm(false);
      setCart([]);
      await fetchAll();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan transaksi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus transaksi ini?")) return;
    try {
      await transaksiService.delete(id);
      await fetchAll();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus transaksi.");
    }
  };

  const totalSalesAll = transactions.reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-stitch-secondary/10 border border-stitch-secondary/20 mb-3">
            <LayoutGrid className="h-3 w-3 text-stitch-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stitch-secondary">
              Alat Kerja Kasir & Penjualan
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stitch-typography mb-1">
            Transaksi Penjualan
          </h1>
          <p className="text-stitch-muted text-sm">
            Pencatatan nota kasir harian dan riwayat pembelian pelanggan.
          </p>
        </div>

        <button
          onClick={handleOpenForm}
          disabled={products.length === 0}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stitch-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stitch-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Catat Transaksi Baru</span>
        </button>
      </section>

      {/* Quick Summary Chips */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-stitch-surface p-5 rounded-2xl border border-stitch-border shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
            <Receipt className="h-16 w-16" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-stitch-muted mb-1">Total Transaksi</div>
          <div className="text-2xl font-bold text-stitch-typography truncate">{transactions.length} Nota</div>
        </div>
        <div className="bg-stitch-surface p-5 rounded-2xl border border-stitch-border shadow-sm relative overflow-hidden">
           <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
            <Tag className="h-16 w-16" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-stitch-muted mb-1">Total Nilai Penjualan</div>
          <div className="text-2xl font-bold text-stitch-secondary truncate">{formatRupiah(totalSalesAll)}</div>
        </div>
        <div className="bg-stitch-surface p-5 rounded-2xl border border-stitch-border shadow-sm relative overflow-hidden">
           <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
            <PackageOpen className="h-16 w-16" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-stitch-muted mb-1">Katalog Siap Jual</div>
          <div className="text-2xl font-bold text-stitch-typography truncate">{products.length} Produk</div>
        </div>
      </section>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stitch-typography/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-stitch-surface border border-stitch-border shadow-lg my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-stitch-border/50 sticky top-0 bg-stitch-surface/95 backdrop-blur-md z-10">
              <div>
                <h2 className="text-lg font-bold text-stitch-primary">Catat Transaksi Penjualan</h2>
                <p className="text-xs text-stitch-muted mt-1">Pilih produk dan masukkan kuantitas yang dibeli</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-10 w-10 shrink-0 rounded-xl text-stitch-muted hover:bg-stitch-border/50 flex items-center justify-center transition-colors"
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

              {/* Add item to cart */}
              <div className="mb-6 rounded-2xl border border-stitch-border bg-stitch-canvas/50 p-5 space-y-4">
                <div className="text-sm font-bold text-stitch-typography">Pilih Item & Jumlah</div>
                <div className="flex flex-col md:flex-row gap-3">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                    className="flex-1 rounded-xl border border-stitch-border bg-stitch-surface px-4 py-3 text-sm text-stitch-typography focus:border-stitch-secondary focus:ring-1 focus:ring-stitch-secondary outline-none transition-all"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama_produk} — {formatRupiah(p.harga_jual)} / {p.satuan}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                      className="w-24 rounded-xl border border-stitch-border bg-stitch-surface px-3 py-3 text-center text-sm font-bold text-stitch-typography focus:border-stitch-secondary outline-none transition-all"
                      placeholder="Qty"
                    />
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="min-h-[46px] rounded-xl bg-stitch-secondary px-5 text-sm font-bold text-white hover:bg-stitch-secondary/90 active:scale-[0.98] transition-all whitespace-nowrap shadow-sm"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Table */}
              {cart.length > 0 ? (
                <div className="mb-6 rounded-2xl border border-stitch-border overflow-hidden bg-stitch-surface shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[400px]">
                      <thead className="bg-stitch-canvas border-b border-stitch-border text-stitch-muted">
                        <tr>
                          <th className="px-5 py-3 text-left font-semibold">Produk</th>
                          <th className="px-5 py-3 text-right font-semibold">Qty</th>
                          <th className="px-5 py-3 text-right font-semibold">Harga</th>
                          <th className="px-5 py-3 text-right font-semibold">Subtotal</th>
                          <th className="px-5 py-3 text-center font-semibold"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stitch-border/50">
                        {cart.map((c) => (
                          <tr key={c.product_id} className="hover:bg-stitch-canvas/30 transition-colors">
                            <td className="px-5 py-4 font-medium text-stitch-typography">{c.nama_produk}</td>
                            <td className="px-5 py-4 text-right font-bold text-stitch-typography">{c.jumlah}</td>
                            <td className="px-5 py-4 text-right text-stitch-muted">{formatRupiah(c.harga_jual)}</td>
                            <td className="px-5 py-4 text-right font-bold text-stitch-primary">
                              {formatRupiah(c.harga_jual * c.jumlah)}
                            </td>
                            <td className="px-5 py-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(c.product_id)}
                                className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-stitch-danger-text hover:bg-stitch-danger-bg transition-colors"
                                title="Hapus item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-stitch-primary/5 border-t border-stitch-primary/10">
                        <tr>
                          <td colSpan={3} className="px-5 py-4 text-right text-sm font-bold text-stitch-typography">
                            Total Tagihan:
                          </td>
                          <td className="px-5 py-4 text-right text-lg font-extrabold text-stitch-primary">
                            {formatRupiah(cartTotal)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mb-6 rounded-2xl border-2 border-dashed border-stitch-border/80 py-10 text-center bg-stitch-canvas/30">
                  <ShoppingCart className="h-8 w-8 text-stitch-muted mx-auto mb-3 opacity-50" />
                  <div className="text-sm text-stitch-muted">
                    Keranjang kosong. Pilih produk dan masukkan kuantitas.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full sm:w-auto min-h-[46px] rounded-xl border border-stitch-border bg-stitch-surface px-6 py-2.5 text-sm font-semibold text-stitch-typography hover:bg-stitch-canvas transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || cart.length === 0}
                  className="flex-1 min-h-[46px] rounded-xl bg-stitch-primary px-6 text-sm font-bold text-white shadow-sm hover:bg-stitch-primary/90 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                       Memproses...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Simpan Nota Pembayaran ({formatRupiah(cartTotal)})</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* States: Loading, Error, Empty, List */}
      {loading && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-stitch-primary border-t-transparent" />
          <div className="text-sm font-medium text-stitch-muted">Memuat riwayat transaksi...</div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-stitch-danger-bg bg-stitch-danger-bg/20 p-5 text-sm text-stitch-danger-text text-center">
          {error}
        </div>
      )}

      {!loading && !error && transactions.length === 0 && (
        <div className="rounded-3xl border border-stitch-border bg-stitch-surface py-16 text-center shadow-sm max-w-2xl mx-auto">
          <Receipt className="h-12 w-12 text-stitch-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-stitch-typography mb-2">Belum Ada Transaksi</h3>
          <p className="text-sm text-stitch-muted max-w-md mx-auto mb-6">
            Mulai catat transaksi pertama untuk melacak penjualan dan performa bisnis Anda.
          </p>
          <button
            onClick={handleOpenForm}
            className="inline-flex items-center gap-2 rounded-xl bg-stitch-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-stitch-primary/90 transition-colors shadow-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Catat Transaksi Pertama</span>
          </button>
        </div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-stitch-border/50">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stitch-primary uppercase tracking-wider">
              Riwayat Transaksi Penjualan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-stitch-surface border border-stitch-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4 border-b border-stitch-border/50 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center justify-center rounded-lg bg-stitch-canvas px-2.5 py-1 text-[11px] font-bold text-stitch-typography border border-stitch-border">
                          TRX-{tx.id.toString().padStart(4, '0')}
                        </span>
                        <span className="text-[11px] text-stitch-muted font-medium">{formatDate(tx.tanggal)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="p-1.5 rounded-lg text-stitch-danger-text hover:bg-stitch-danger-bg transition-colors"
                      title="Hapus Transaksi"
                    >
                       <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    {tx.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between text-sm gap-3">
                        <div className="flex gap-2">
                           <span className="text-stitch-secondary font-bold text-xs bg-stitch-secondary/10 px-1.5 py-0.5 rounded">{item.jumlah}x</span>
                           <span className="text-stitch-typography font-medium line-clamp-2">
                            {item.nama_produk ?? `Produk #${item.product_id}`}
                          </span>
                        </div>
                        <span className="font-semibold text-stitch-typography shrink-0">{formatRupiah(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stitch-border border-dashed flex items-center justify-between mt-auto">
                  <span className="text-xs text-stitch-muted font-bold uppercase tracking-wider">Total</span>
                  <span className="text-lg font-extrabold text-stitch-primary">{formatRupiah(tx.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
