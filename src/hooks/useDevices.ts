import { DeviceContext } from "@src/context/DeviceContext";
import { useContext } from "react";

 export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevices must be used within a DeviceProvider");
  }
  return context;
  };