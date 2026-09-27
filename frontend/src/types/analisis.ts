export interface PriceAnalysisItem {
  product_id: number;
  nama_produk: string;
  kategori?: string | null;
  harga_jual: number | string;
  harga_modal: number | string;
  harga_min_ref?: number | string | null;
  harga_max_ref?: number | string | null;
  satuan: string;
  status: string; // "Di bawah referensi" | "Dalam rentang wajar" | "Di atas referensi" | "Belum ada referensi"
  margin_persen: number;
  rekomendasi: string;
}

export interface PriceAnalysisResponse {
  items: PriceAnalysisItem[];
}

export interface ProductPerformanceItem {
  product_id: number;
  nama_produk: string;
  kategori?: string | null;
  total_terjual: number;
  total_omzet: number | string;
  total_hpp: number | string;
  total_laba: number | string;
  margin_persen: number;
}

export interface ProductAnalysisResponse {
  produk_terlaris: ProductPerformanceItem[];
  produk_omzet_tertinggi: ProductPerformanceItem[];
  produk_margin_tertinggi: ProductPerformanceItem[];
  produk_laris_margin_rendah: ProductPerformanceItem[];
  semua_produk: ProductPerformanceItem[];
}

export interface FinancialPeriodSummary {
  omzet: number | string;
  hpp: number | string;
  laba_kotor: number | string;
  pengeluaran: number | string;
  laba_bersih: number | string;
  margin_persen: number;
}

export interface FinancialAnalysisResponse {
  periode_ini: FinancialPeriodSummary;
  periode_lalu: FinancialPeriodSummary;
  perubahan_omzet_persen: number;
  perubahan_laba_bersih_persen: number;
  perubahan_pengeluaran_persen: number;
}

export interface InsightItem {
  id: string;
  kategori: string;
  tipe: "positif" | "perhatian" | "netral";
  pesan: string;
}

export interface WarningItem {
  id: string;
  type: string;
  severity: "danger" | "warning" | "info";
  title: string;
  message: string;
  related_data?: Record<string, unknown> | null;
}

export interface InsightsResponse {
  insights: InsightItem[];
  warnings: WarningItem[];
}
