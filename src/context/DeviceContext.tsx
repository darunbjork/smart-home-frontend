import { createContext, useReducer, type ReactNode, useEffect, useCallback } from "react";
import { deviceReducer, type DeviceState } from "../reducers/device.reducer";
import { deviceApi } from "../api/device.api";
import { useHouseholds } from "./HouseholdContext";
import { useToast } from "./ToastContext";
import { io, Socket } from "socket.io-client";
  import { useContext } from "react";
interface DeviceContextValue {
  state: DeviceState;
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
  });

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
      dispatch({ type: "SET_ERROR", payload: "Failed to load devices" });
    }
  }, [activeId]);

  const toggleDevice = async (id: string, currentState: boolean) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch({ type: "UPDATE_DEVICE", payload: { _id: id, data: { on: !currentState } } as any });
      await deviceApi.updateData(id, { on: !currentState });
    } catch (err) {
      console.error("Failed to toggle device", err);
      showToast("Failed to toggle device. Please try again.", "error");
    }
  };

  // Socket.IO Real-time Sync & Toast Notifications
  useEffect(() => {
    if (!activeId) return;

    const socket: Socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    socket.emit("join-household", activeId);

    socket.on("device-updated", (updatedDevice) => {
      dispatch({ type: "UPDATE_DEVICE", payload: updatedDevice });

      // Global Toast Notification
      showToast(
        `${updatedDevice.name} is now ${updatedDevice.data.on ? 'ON' : 'OFF'}`,
        "info"
      );
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
    throw new Error("useDevices must be used within a DeviceProvider");
  }
  return context;
  };