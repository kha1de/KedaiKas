import { apiClient } from "./api";
import { Product, ProductInput } from "@/types/produk";

export const produkService = {
  async getAll(): Promise<Product[]> {
    return apiClient<Product[]>("/products");
  },

  async getById(id: number): Promise<Product> {
    return apiClient<Product>(`/products/${id}`);
  },

  async create(data: ProductInput): Promise<Product> {
    return apiClient<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Partial<ProductInput>): Promise<Product> {
    return apiClient<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    });
  },
};
