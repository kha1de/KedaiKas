import { apiClient } from "./api";
import { Transaction, TransactionInput } from "@/types/transaksi";

export const transaksiService = {
  async getAll(startDate?: string, endDate?: string): Promise<Transaction[]> {
    return apiClient<Transaction[]>("/transactions", {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  },

  async getById(id: number): Promise<Transaction> {
    return apiClient<Transaction>(`/transactions/${id}`);
  },

  async create(data: TransactionInput): Promise<Transaction> {
    return apiClient<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/transactions/${id}`, {
      method: "DELETE",
    });
  },
};
