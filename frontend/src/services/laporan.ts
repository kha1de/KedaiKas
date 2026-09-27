import { apiClient } from "./api";
import { ReportData } from "@/types/laporan";

export const laporanService = {
  async getReport(startDate?: string, endDate?: string): Promise<ReportData> {
    return apiClient<ReportData>("/reports", {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  },
};
