import type { Device } from "../types/device.types";

export interface DeviceState {
  devices:   Device[];
  isLoading: boolean;
  error:     string | null;
}

export type DeviceAction =
  | { type: "SET_DEVICES"; payload: Device[] }
  | { type: "UPDATE_DEVICE"; payload: Device }
  | { type: "DELETE_DEVICE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

export function deviceReducer(state: DeviceState, action: DeviceAction): DeviceState {
  switch (action.type) {
    case "SET_DEVICES":
      return { 
        ...state, 
        devices: action.payload, 
        isLoading: false,
        error: null 
      };
    case "UPDATE_DEVICE":
      return {
        ...state,
        devices: state.devices.map((d) => 
          d._id === action.payload._id ? action.payload : d
        ),
      };
    case "DELETE_DEVICE":
      return {
        ...state,
        devices: state.devices.filter((d) => d._id !== action.payload),
      };
    case "SET_LOADING": 
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}
