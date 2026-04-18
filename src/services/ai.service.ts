import { api } from "../api/axios";
import type { Device } from "../types/device.types";

export interface AISmartAction {
  id: string;
  action: "on" | "off";
}

export const aiService = {
  processCommand: async (prompt: string, devices: Device[]): Promise<AISmartAction[]> => {
    const response = await api.post("/ai/command", { prompt, devices });
    return response.data.actions;
  },
};
