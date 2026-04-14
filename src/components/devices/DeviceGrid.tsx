import { useContext } from "react";
import { DeviceContext } from "../../context/DeviceContext";
import { DeviceCard } from "./DeviceCard";
import { Button } from "../ui/Button"; // Added import for Button

interface DeviceGridProps {
  onAddClick: () => void;
}

export const DeviceGrid = ({ onAddClick }: DeviceGridProps) => {
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

  // 2. Empty State
  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-[var(--space-16)] border-2 border-dashed border-[var(--border)] rounded-[var(--space-4)] text-center bg-[var(--bg-surface)]/50">
        <div className="w-16 h-16 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mb-4 border border-[var(--border)]">
           <span className="text-2xl text-[var(--text-secondary)]">🔌</span>
        </div>
        <h3 className="text-[var(--text-xl)] font-[var(--weight-bold)] mb-2">No devices found</h3>
        <p className="text-[var(--text-secondary)] mb-6 max-w-xs mx-auto">
          Your home is a bit quiet. Connect your first smart light or sensor to get started.
        </p>
        <Button variant="secondary" onClick={onAddClick}>
          Connect Your First Device
        </Button>
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
