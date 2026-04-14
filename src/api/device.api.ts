import { api } from "./axios";
import type { Device, DeviceData } from "../types/device.types";

export interface CreateDeviceDto {
  name:      string;
  type:      string;
  household: string;
}

export const deviceApi = {
  getByHousehold: (householdId: string): Promise<Device[]> => 
    api.get(`/devices/household/${householdId}`).then(r => r.data),

  create: (dto: CreateDeviceDto): Promise<Device> => 
    api.post("/devices", dto).then(r => r.data),

  update: (id: string, update: Partial<Device>): Promise<Device> => 
    api.patch(`/devices/${id}`, update).then(r => r.data),

  updateData: (id: string, data: DeviceData): Promise<Device> => 
    api.patch(`/devices/${id}/data`, data).then(r => r.data),

  delete: (id: string): Promise<void> => 
    api.delete(`/devices/${id}`).then(r => r.data),
};
