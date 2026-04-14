import { Button } from "../../ui/Button";
import type { Device } from "../../../types/device.types";

interface LightControlProps {
  device: Device;
  onToggle: () => void;
}

export const LightControl = ({ device, onToggle }: LightControlProps) => {
  // Ensure device.data exists and has an 'on' property, default to false if not
  const isOn = !!device?.data?.on; 

  return (
    <div className="flex items-center justify-between bg-[var(--bg-primary)] p-[var(--space-2)] rounded-[var(--space-2)]">
      <span className="text-[var(--text-sm)]">
        Status: <strong className={isOn ? "text-[var(--brand)]" : "text-[var(--text-secondary)]"}>
          {isOn ? "ON" : "OFF"}
        </strong>
      </span>
      <Button 
        variant={isOn ? "primary" : "secondary"} 
        size="sm" 
        onClick={onToggle}
      >
        {isOn ? "Turn Off" : "Turn On"}
      </Button>
    </div>
  );
};
