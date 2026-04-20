import { useState, useEffect } from "react";
import { useHouseholds } from "../../context/HouseholdContextSetup";
import { deviceApi } from "../../api/device.api";
import { sceneApi, type SceneAction } from "../../api/scene.api";
import type { Device } from "../../types/device.types";
import { Button } from "../ui/Button";

export const CreateSceneForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { state } = useHouseholds();
  const [devices, setDevices] = useState<Device[]>([]);
  const [sceneName, setSceneName] = useState("");
  const [selectedActions, setSelectedActions] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state.activeHouseholdId) {
      deviceApi.getByHousehold(state.activeHouseholdId).then(setDevices);
    }
  }, [state.activeHouseholdId]);

  const toggleDevice = (deviceId: string) => {
    setSelectedActions(prev => {
      const next = { ...prev };
      if (deviceId in next) {
        delete next[deviceId]; 
      } else {
        next[deviceId] = true; 
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneName || Object.keys(selectedActions).length === 0) return;

    setIsSubmitting(true);
    try {
      const actions: SceneAction[] = Object.entries(selectedActions).map(([deviceId, value]) => ({
        deviceId,
        action: 'toggle',
        value: value,
        data: {}
      }));

      await sceneApi.create({
        name: sceneName,
        householdId: state.activeHouseholdId!,
        actions
      });
      onSuccess();
    } catch (err) {
      console.error("Failed to create scene", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-(--text-secondary)">Scene Name</label>
        <input
          className="bg-(--bg-primary) border border-(--border) p-3 rounded-xl outline-none focus:border-(--brand) transition-colors"
          placeholder="e.g., Movie Night"
          value={sceneName}
          onChange={(e) => setSceneName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-(--text-secondary)">Select Devices & States</label>
        <div className="grid grid-cols-1 gap-2 pr-2 overflow-y-auto max-h-48">
          {devices.map(device => (
            <div key={device._id} className="flex items-center justify-between p-3 bg-(--bg-primary) rounded-xl border border-(--border)">
              <span className="text-sm font-medium">{device.name}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleDevice(device._id)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    device._id in selectedActions 
                      ? 'bg-(--brand) text-white' 
                      : 'bg-(--bg-surface) text-(--text-secondary) border border-(--border)'
                  }`}
                >
                  {selectedActions[device._id] ? 'Turn ON' : 'Exclude'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Save Scene"}
      </Button>
    </form>
  );
};