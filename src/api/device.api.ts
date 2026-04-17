import { api } from "./axios";
import type { Device } from "../types/device.types";

export const deviceApi = {
  getByHousehold: (householdId: string): Promise<Device[]> =>
    api.get(`/devices/household/${householdId}`).then(r => r.data.devices),

  updateData: (id: string, data: Partial<Device["data"]>): Promise<void> =>
    api.patch(`/devices/${id}`, data).then(r => r.data),

  create: (device: Omit<Device, "_id" | "data"> & { data?: Partial<Device["data"]> }): Promise<Device> =>
    api.post('/devices', device).then(r => r.data),
};
