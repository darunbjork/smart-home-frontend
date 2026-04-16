import { api } from "./axios";
import type { Device } from "../types/device.types";

export const deviceApi = {
  getByHousehold: (householdId: string): Promise<Device[]> => 
    api.get(`/devices/household/${householdId}`).then(r => r.data.devices), // ✅ Extract array

  updateData: (id: string, data: Partial<Device["data"]>): Promise<void> =>
    api.put(`/devices/${id}`, data).then(r => r.data),
};
