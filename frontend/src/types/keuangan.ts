export interface Expense {
  id: number;
  user_id: number;
  kategori: string;
  nominal: number | string;
  tanggal: string;
  keterangan?: string | null;
  created_at?: string;
}

export interface ExpenseInput {
  kategori: string;
  nominal: number;
  tanggal: string;
  keterangan?: string;
}
