export interface TransactionItem {
  id: number;
  transaction_id?: number;
  product_id: number;
  nama_produk?: string;
  jumlah: number;
  harga_jual: number | string;
  subtotal: number | string;
}

export interface Transaction {
  id: number;
  user_id: number;
  tanggal: string;
  total: number | string;
  created_at?: string;
  items: TransactionItem[];
}

export interface TransactionItemInput {
  product_id: number;
  jumlah: number;
  harga_jual?: number;
}

export interface TransactionInput {
  tanggal?: string;
  items: TransactionItemInput[];
}
