import { useContext } from "react";
import { DeviceContext } from "../../context/DeviceContext";
import { DeviceCard } from "./DeviceCard";

export const DeviceGrid = () => {
  const deviceCtx = useContext(DeviceContext);

  if (!deviceCtx) return null;
  const { devices, isLoading } = deviceCtx.state;

  // 1. Loading State (Skeleton Grid)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-6)]">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="h-40 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--space-3)] animate-pulse" 
          />
        ))}
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-[var(--space-12)] border-2 border-dashed border-[var(--border)] rounded-[var(--space-4)] text-center">
        <h3 className="text-[var(--text-lg)] font-[var(--weight-bold)]">No devices found</h3>
        <p className="text-[var(--text-secondary)] mb-[var(--space-4)]">
          Start by adding your first smart device to this household.
        </p>
      </div>
    );
  }

  // 3. Populated State
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-6)] animate-slide-up">
      {devices.map((device) => (
        <DeviceCard key={device._id} device={device} />
      ))}
    </div>
  );
};
