export interface Product {
  id: number;
  user_id: number;
  nama_produk: string;
  kategori?: string | null;
  harga_modal: number | string;
  harga_jual: number | string;
  satuan: string;
  margin_persen: number;
  created_at?: string;
}

export interface ProductInput {
  nama_produk: string;
  kategori?: string;
  harga_modal: number;
  harga_jual: number;
  satuan: string;
}
