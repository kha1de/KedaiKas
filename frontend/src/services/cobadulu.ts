import { apiClient } from "./api";
import { SimulationRequest, SimulationResponse } from "@/types/cobadulu";

export const cobaduluService = {
  async runSimulation(data: SimulationRequest): Promise<SimulationResponse> {
    return apiClient<SimulationResponse>("/simulation", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
