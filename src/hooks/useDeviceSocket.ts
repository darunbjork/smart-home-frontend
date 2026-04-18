import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { tokenUtils } from "../utils/token";
import { type Device } from "../types/device.types";

let socket: Socket | null = null;

export const useDeviceSocket = (
  householdId: string | undefined, 
  onUpdate: (updatedDevice: Device) => void
) => {
  // Use a ref for the callback so the effect doesn't re-run 
  // every time the parent re-renders the callback function.
  const updateHandlerRef = useRef(onUpdate);
  
  useEffect(() => {
    updateHandlerRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!householdId) return;

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    
    socket = io(API_URL, {
      auth: { token: tokenUtils.getToken() },
      transports: ['websocket'] // Preferred for real-time
    });

    socket.on("connect", () => {
      console.log("🔌 Connected to HomeBot Socket");
      socket?.emit("join-household", householdId);
    });

    socket.on("device:update", (data: Device) => {
      updateHandlerRef.current(data);
    });

    return () => {
      if (socket) {
        socket.off("device:update");
        socket.disconnect();
        socket = null;
      }
    };
  }, [householdId]);

  return socket;
};
