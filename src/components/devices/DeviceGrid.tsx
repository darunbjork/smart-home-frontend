import { useEffect, useState } from "react";
import { useHouseholds } from "../../context/HouseholdContextSetup";
import { deviceApi } from "../../api/device.api";
import { type Device } from "../../types/device.types";

export const DeviceGrid = () => {
  const { state } = useHouseholds();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.activeHouseholdId) {
      deviceApi.getByHousehold(state.activeHouseholdId).then((data) => {
        setDevices(data);
        setLoading(false);
      });
    }
  }, [state.activeHouseholdId]);

  const handleToggle = async (deviceId: string, currentState: boolean) => {
    // Optimistic UI Update
    setDevices((prev) =>
      prev.map((d) => (d._id === deviceId ? { ...d, data: { ...d.data, on: !currentState } } : d))
    );

    try {
      await deviceApi.updateData(deviceId, { on: !currentState });
    } catch (error) {
      // Revert on failure
      console.error("Toggle failed", error);
      const original = await deviceApi.getByHousehold(state.activeHouseholdId!);
      setDevices(original);
    }
  };

  if (loading) return <div className="grid grid-cols-1 gap-6 md:grid-cols-3 animate-pulse">
    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-(--bg-surface) rounded-2xl border border-(--border)" />)}
  </div>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => (
        <div key={device._id} className="bg-(--bg-surface) border border-(--border) p-6 rounded-2xl flex items-center justify-between hover:border-(--brand)/50 transition-all group">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              device.data.on ? 'bg-(--brand) text-white shadow-lg shadow-(--brand)/20' : 'bg-(--bg-primary) text-(--text-secondary)'
            }`}>
              {/* Simple Icon Logic */}
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
