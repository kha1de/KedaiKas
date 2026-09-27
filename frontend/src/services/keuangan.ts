import { apiClient } from "./api";
import { Expense, ExpenseInput } from "@/types/keuangan";

export const keuanganService = {
  async getAll(startDate?: string, endDate?: string): Promise<Expense[]> {
    return apiClient<Expense[]>("/expenses", {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  },

  async getById(id: number): Promise<Expense> {
    return apiClient<Expense>(`/expenses/${id}`);
  },

  async create(data: ExpenseInput): Promise<Expense> {
    return apiClient<Expense>("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Partial<ExpenseInput>): Promise<Expense> {
    return apiClient<Expense>(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/expenses/${id}`, {
      method: "DELETE",
    });
  },
};
