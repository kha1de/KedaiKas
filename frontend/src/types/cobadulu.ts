export interface SimulationProductInput {
  product_id: number;
  nama_produk?: string;
  harga_jual_baru?: number;
  jumlah_penjualan_baru?: number;
  harga_modal_baru?: number;
}

export interface SimulationRequest {
  produk_simulasi: SimulationProductInput[];
  pengeluaran_baru?: number;
  target_laba_simulasi?: number;
}

export interface MetricProjection {
  omzet: number | string;
  hpp: number | string;
  laba_kotor: number | string;
  pengeluaran: number | string;
  laba_bersih: number | string;
  margin_persen: number;
}

export interface MetricDifference {
  omzet_diff: number | string;
  hpp_diff: number | string;
  pengeluaran_diff: number | string;
  laba_bersih_diff: number | string;
  margin_diff_persen: number;
}

export interface SimulationTargetComparison {
  target_laba: number | string;
  gap_saat_ini: number | string;
  gap_proyeksi: number | string;
  progress_saat_ini_persen: number;
  progress_proyeksi_persen: number;
  status_proyeksi: string;
}

export interface SimulationResponse {
  saat_ini: MetricProjection;
  proyeksi_simulasi: MetricProjection;
  selisih: MetricDifference;
  perbandingan_target: SimulationTargetComparison;
  catatan: string;
}
