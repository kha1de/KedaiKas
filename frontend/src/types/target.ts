export interface Target {
  id: number;
  user_id: number;
  target_laba: number | string;
  periode_mulai: string;
  periode_selesai: string;
  created_at?: string;
}

export interface TargetInput {
  target_laba: number;
  periode_mulai: string;
  periode_selesai: string;
}

export interface TargetProgress {
  target?: Target | null;
  target_laba: number | string;
  laba_saat_ini: number | string;
  target_gap: number | string;
  hari_tersisa: number;
  kebutuhan_laba_harian: number | string;
  progress_persen: number;
  status: string;
}
