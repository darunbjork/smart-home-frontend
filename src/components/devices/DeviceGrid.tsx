import { useEffect, useState } from "react";
import { useHouseholds } from "../../context/HouseholdContextSetup";
import { deviceApi } from "../../api/device.api";
import { useDeviceSocket } from "../../hooks/useDeviceSocket";
import { type Device } from "../../types/device.types";

export const DeviceGrid = () => {
  const { state } = useHouseholds();
  const [devices, setDevices] = useState<Device[]>([]);

  // 1. Initial Fetch
  useEffect(() => {
    if (state.activeHouseholdId) {
      deviceApi.getByHousehold(state.activeHouseholdId).then(setDevices);
    }
  }, [state.activeHouseholdId]);

  // 2. Real-time Sync (Socket)
  useDeviceSocket(state.activeHouseholdId ?? undefined, (updatedDevice) => {
    setDevices((prev) => 
      prev.map((d) => (d._id === updatedDevice._id ? updatedDevice : d))
    );
  });

  const handleToggle = async (deviceId: string, currentState: boolean) => {
    // 3. Optimistic UI: Update locally immediately
    setDevices((prev) =>
      prev.map((d) => (d._id === deviceId ? { ...d, data: { ...d.data, on: !currentState } } : d))
    );

    try {
      await deviceApi.updateData(deviceId, { on: !currentState });
    } catch (error) {
      console.error("Toggle failed, reverting...", error);
      // Re-fetch to sync with server state on error
      if (state.activeHouseholdId) {
        const fresh = await deviceApi.getByHousehold(state.activeHouseholdId);
        setDevices(fresh);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => (
        <div key={device._id} className="bg-(--bg-surface) border border-(--border) p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              device.data.on ? 'bg-(--brand) text-white' : 'bg-(--bg-primary) text-(--text-secondary)'
            }`}>
              {device.type === 'light' ? '💡' : '🔌'}
            </div>
            <div>
              <p className="font-bold text-(--text-primary)">{device.name}</p>
              <p className="text-xs text-(--text-secondary) uppercase tracking-widest">{device.type}</p>
            </div>
          </div>
          
          {(device.type === 'light' || device.type === 'switch') && (
            <button 
              onClick={() => handleToggle(device._id, !!device.data.on)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                device.data.on ? 'bg-(--brand)' : 'bg-(--border)'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                device.data.on ? 'left-7' : 'left-1'
              }`} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
