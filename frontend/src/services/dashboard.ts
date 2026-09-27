import { apiClient } from "./api";
import { DashboardData } from "@/types/dashboard";

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    return apiClient<DashboardData>("/dashboard");
  },
};
