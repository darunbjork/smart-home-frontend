export type DeviceStatus = "online" | "offline" | "unknown" | "pending";

export interface DeviceData {
  on?:          boolean;
  brightness?:  number;
  temperature?: number;
  humidity?:    number;
  locked?:      boolean;
  [key: string]: unknown; // Flexible but safe - never 'any'
}

export interface Device {
  _id:       string;
  name:      string;
  type:      string;
  status:    DeviceStatus;
  household: string;
  owner:     string;
  data:      DeviceData;
  createdAt: string;
  updatedAt: string;
}