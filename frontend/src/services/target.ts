import { apiClient } from "./api";
import { Target, TargetInput, TargetProgress } from "@/types/target";

export const targetService = {
  async getAll(): Promise<Target[]> {
    return apiClient<Target[]>("/targets");
  },

  async getProgress(): Promise<TargetProgress> {
    return apiClient<TargetProgress>("/targets/progress");
  },

  async create(data: TargetInput): Promise<Target> {
    return apiClient<Target>("/targets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: Partial<TargetInput>): Promise<Target> {
    return apiClient<Target>(`/targets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
