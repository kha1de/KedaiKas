import { ProductPerformanceItem } from "./analisis";

export interface ReportData {
  periode_mulai?: string | null;
  periode_selesai?: string | null;
  total_transaksi: number;
  omzet: number | string;
  hpp: number | string;
  laba_kotor: number | string;
  pengeluaran: number | string;
  laba_bersih: number | string;
  margin_persen: number;
  ringkasan_produk: ProductPerformanceItem[];
}
