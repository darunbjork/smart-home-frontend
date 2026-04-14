import React, { createContext, useReducer, ReactNode, useEffect, useContext } from "react";
import { deviceReducer, type DeviceState } from "../reducers/device.reducer";
import { deviceApi } from "../api/device.api";
import { useHouseholds } from "./HouseholdContext";
// Assuming socket.io-client is available or intended to be added
import { io, Socket } from "socket.io-client"; 

interface DeviceContextValue {
  state: DeviceState;
  toggleDevice: (id: string, currentState: boolean) => Promise<void>;
  refreshDevices: () => Promise<void>;
}

export const DeviceContext = createContext<DeviceContextValue | null>(null);

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(deviceReducer, {
    devices: [],
    isLoading: false,
    error: null,
  });

  const { state: householdState } = useHouseholds();
  const activeId = householdState.activeHouseholdId;

  // 1. Initial Fetch
  const refreshDevices = async () => {
    if (!activeId) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await deviceApi.getByHousehold(activeId);
      dispatch({ type: "SET_DEVICES", payload: data });
    } catch (err) {
      // Added console.error for better debugging in case of network issues
      console.error("Failed to fetch devices:", err); 
      dispatch({ type: "SET_ERROR", payload: "Failed to load devices" });
    }
  };

  // 2. Optimistic Toggle
  const toggleDevice = async (id: string, currentState: boolean) => {
    try {
      // Optimistically update UI first
      // Assuming Device type has an 'on' property for toggling
      dispatch({ type: "UPDATE_DEVICE", payload: { _id: id, on: !currentState } as any }); 
      await deviceApi.updateData(id, { on: !currentState }); // Send update to backend
    } catch (err) {
      console.error("Failed to toggle device");
      // In a real app, you might want to revert the UI state here if the API call fails.
      // For now, we'll just log the error.
    }
  };

  // 3. Socket.IO Real-time Sync
  useEffect(() => {
    if (!activeId) return;

    // Ensure VITE_API_URL is correctly set for Socket.IO connection
    // Fallback to localhost:3000 if not provided, adjust as needed for your backend setup
    const socket: Socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000'); 
    
    // Join a room specific to this household
    socket.emit("join-household", activeId);

    socket.on("device-updated", (updatedDevice) => {
      // Ensure the payload is correctly typed for dispatch
      dispatch({ type: "UPDATE_DEVICE", payload: updatedDevice });
    });

    // Cleanup function to disconnect the socket when the component unmounts or activeId changes
    return () => {
      socket.disconnect();
    };
  }, [activeId]); // Re-run effect if activeId changes

  // Re-fetch devices whenever the active household changes
  useEffect(() => {
    refreshDevices();
  }, [activeId]);

  return (
    <DeviceContext.Provider value={{ state, toggleDevice, refreshDevices }}>
      {children}
    </DeviceContext.Provider>
  );
};
