import type { DeviceData } from "../types/device.types";

export interface SceneAction {
  deviceId: string;
  data: Partial<DeviceData>;
}

export interface Scene {
  _id: string;
  name: string;
  icon: string;
  household: string;
  actions: SceneAction[];
}
