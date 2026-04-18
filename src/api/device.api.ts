import { api } from "./axios";
import type { Device, DeviceData, CreateDeviceDto } from "../types/device.types";

export const deviceApi = {
  getByHousehold: (householdId: string): Promise<Device[]> =>
    api.get(`/devices/household/${householdId}`).then(r => r.data.devices),

  // Matches contract: PATCH /devices/:id with { data: { on: boolean } }
  updateData: (id: string, data: Partial<DeviceData>): Promise<Device> =>
    api.patch(`/devices/${id}`, { data }).then(r => r.data),

  create: (dto: CreateDeviceDto): Promise<Device> =>
    api.post('/devices', dto).then(r => r.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/devices/${id}`).then(r => r.data),
};
