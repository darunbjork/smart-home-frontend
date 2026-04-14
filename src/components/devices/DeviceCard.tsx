import { useContext } from "react";
import { DeviceContext } from "../../context/DeviceContext";
import { Badge } from "../ui/Badge";
import type { Device } from "../../types/device.types";
import { LightControl } from "./controls/LightControl";

export const DeviceCard = ({ device }: { device: Device }) => {
  const deviceCtx = useContext(DeviceContext);

  if (!deviceCtx) return null;

  // Logic to determine which control to render based on device type
  const renderControl = () => {
    switch (device.type.toLowerCase()) {
      case "light":
        return <LightControl device={device} onToggle={() => deviceCtx.toggleDevice(device._id, !!device.data.on)} />;
      default:
        return <p className="text-[var(--text-muted)] text-sm">No controls available</p>;
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--space-3)] p-[var(--space-4)] flex flex-col gap-[var(--space-4)] hover:border-[var(--brand)] transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-[var(--weight-bold)] text-[var(--text-primary)]">{device.name}</h3>
          <p className="text-[var(--text-xs)] text-[var(--text-secondary)] uppercase tracking-wider">
            {device.type}
          </p>
        </div>
        <Badge value={device.status} />
      </div>

      <div className="mt-auto">
        {renderControl()}
      </div>
    </div>
  );
};
