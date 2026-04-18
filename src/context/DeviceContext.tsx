import { createContext, useContext, useReducer, type ReactNode, useEffect, useCallback } from "react";
import { deviceReducer, type DeviceState } from "../reducers/device.reducer";
import { deviceApi } from "../api/device.api";
import { useHouseholds } from "./HouseholdContext";
import { useToast } from "../hooks/useToast";
import { io, Socket } from "socket.io-client";
import type { Device } from "../types/device.types";

interface DeviceContextValue {
  state: { devices: Device[]; isLoading: boolean; error: string | null };
  toggleDevice: (id: string, currentState: boolean) => Promise<void>;
  refreshDevices: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DeviceContext = createContext<DeviceContextValue | null>(null);

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(deviceReducer, {
    devices: [],
    isLoading: false,
    error: null,
  } as DeviceState);

  const { state: householdState } = useHouseholds();
  const { showToast } = useToast();
  const activeId = householdState.activeHouseholdId;

  const refreshDevices = useCallback(async () => {
    if (!activeId) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await deviceApi.getByHousehold(activeId);
      dispatch({ type: "SET_DEVICES", payload: data });
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    }
  }, [activeId]);

  const toggleDevice = async (id: string, currentState: boolean) => {
    try {
      const deviceToUpdate = state.devices.find(d => d._id === id);
      if (!deviceToUpdate) {
        console.error(`Device with id ${id} not found.`);
        showToast("Device not found", "error");
        return;
      }

      const updatedDevice: Device = {
        ...deviceToUpdate,
        data: {
          ...deviceToUpdate.data,
          on: !currentState,
        },
      };

      dispatch({
        type: "UPDATE_DEVICE",
        payload: updatedDevice, 
      });

      await deviceApi.updateData(id, { on: !currentState });
    } catch (err) {
      console.error("Failed to toggle device", err);
      showToast("Failed to toggle device", "error");
    }
  };

  useEffect(() => {
    if (!activeId) return;

    const socket: Socket = io(import.meta.env.VITE_API_URL);
    socket.emit("join-household", activeId);

    socket.on("device-updated", (updatedDevice: Device) => {
      dispatch({ type: "UPDATE_DEVICE", payload: updatedDevice });
      showToast(`${updatedDevice.name} updated`, "info");
    });
    
    return () => {
      socket.disconnect();
    };
  }, [activeId, showToast]);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  return (
    <DeviceContext.Provider value={{ state, toggleDevice, refreshDevices }}>
      {children}
    </DeviceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevices must be used within DeviceProvider. Engineering Rule #1: Check your providers.");
  }
  return context;
};