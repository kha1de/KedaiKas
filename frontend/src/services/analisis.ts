import { apiClient } from "./api";
import {
  PriceAnalysisResponse,
  ProductAnalysisResponse,
  FinancialAnalysisResponse,
  InsightsResponse,
} from "@/types/analisis";

export const analisisService = {
  async getPriceAnalysis(): Promise<PriceAnalysisResponse> {
    return apiClient<PriceAnalysisResponse>("/analysis/price");
  },

  async getProductAnalysis(): Promise<ProductAnalysisResponse> {
    return apiClient<ProductAnalysisResponse>("/analysis/products");
  },

  async getFinancialAnalysis(): Promise<FinancialAnalysisResponse> {
    return apiClient<FinancialAnalysisResponse>("/analysis/finance");
  },

  async getInsights(): Promise<InsightsResponse> {
    return apiClient<InsightsResponse>("/analysis/insights");
  },
};
