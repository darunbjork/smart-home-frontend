import { Button } from "../../ui/Button";
import type { Device } from "../../../types/device.types";

interface LightControlProps {
  device: Device;
  onToggle: () => void;
}

export const LightControl = ({ device, onToggle }: LightControlProps) => {
  // Ensure device.data exists and has an 'on' property, default to false if not
  const isOn = !!device?.data?.on; // ! double‑bang (!!) operator.  
  // * !! converts any value into a strict boolean (true or false).

  return (
    <div className="flex items-center justify-between bg-(--bg-primary) p-(--space-2) rounded-(--space-2)">
      <span className="text-(--text-sm)">
        Status: <strong className={isOn ? "text-(--brand)" : "text-(--text-secondary)"}>
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
