import { useContext, memo } from "react"; 
import { DeviceContext } from "../../context/DeviceContext";
import { Badge } from "../ui/Badge";
import type { Device } from "../../types/device.types";
import { LightControl } from "./controls/LightControl";

const DeviceCardComponent = ({ device }: { device: Device }) => { 
  const deviceCtx = useContext(DeviceContext);

  if (!deviceCtx) {
    console.error("DeviceContext not found");
    return null; 
  }

  const renderControl = () => {
    const isOn = !!device.data?.on;
    switch (device.type.toLowerCase()) {
      case "light":
        return <LightControl device={device} onToggle={() => deviceCtx.toggleDevice(device._id, isOn)} />;
      default:
        return <p className="text-(--text-muted) text-sm">No controls available</p>;
    }
  };

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-(--space-3) p-(--space-4) flex flex-col gap-(--space-4) hover:border-(--brand) transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-(--weight-bold) text-(--text-primary)">{device.name}</h3>
          <p className="text-(--text-secondary) uppercase tracking-wider">
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


export const DeviceCard = memo(DeviceCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.device.status === nextProps.device.status &&
    JSON.stringify(prevProps.device.data) === JSON.stringify(nextProps.device.data) &&
    prevProps.device.name === nextProps.device.name
  );
});
