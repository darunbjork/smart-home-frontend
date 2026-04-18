export type DeviceType = 'light' | 'switch' | 'sensor' | 'thermostat' | 'camera';

export interface DeviceData {
  on?: boolean;
  brightness?: number;
  temperature?: number;
  motion?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface Device {
  _id: string;
  name: string;
  type: DeviceType;
  status: 'online' | 'offline' | 'unknown' | 'pending';
  household: string;
  owner: string;
  data: DeviceData;
}

export interface CreateDeviceDto {
  name: string;
  type: DeviceType;
  householdId: string;
  data?: Partial<DeviceData>;
}

export interface UpdateDeviceDto {
  name?: string;
  status?: string;
  data?: Partial<DeviceData>;
}
