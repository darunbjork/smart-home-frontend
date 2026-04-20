import { api } from "../api/axios";
import type { Device } from "../types/device.types"; 

export const aiService = {
  processCommand: async (prompt: string, devices: Device[]) => {
    const res = await api.post("/ai/process", { 
      prompt, 
      devices 
    });
    return res.data.actions || [];
  },
};