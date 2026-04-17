import React, { useState, useContext } from "react";
import { DeviceContext } from "../../context/DeviceContext";
import { useHouseholds } from "../../context/HouseholdContext";
import { deviceApi } from "../../api/device.api";
import { Button } from "../ui/Button";

export const AddDeviceForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { refreshDevices } = useContext(DeviceContext)!;
  const { state: hState } = useHouseholds();
  
  const [formData, setFormData] = useState({ name: "", type: "Light" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hState.activeHouseholdId) return;

    setIsSubmitting(true);
    try {
      await deviceApi.create({
        name: formData.name,
        type: formData.type,
        household: hState.activeHouseholdId,
        status: "online",
        owner: "",
        createdAt: "",
        updatedAt: ""
      });
      await refreshDevices();
      onSuccess();
    } catch (err) {
      console.error("Failed to create device", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-(--space-6)">
      <div className="flex flex-col gap-(--space-2)">
        <label className="text-(--text-sm)">Device Name</label>
        <input 
          autoFocus
          required
          className="bg-(--bg-primary) border border-(--border) rounded-(--space-1) p-(--space-3) outline-none focus:border-(--brand)"
          placeholder="e.g. Kitchen Chandelier"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-(--space-2)">
        <label className="text-(--text-sm)">Device Type</label>
        <select 
          className="bg-(--bg-primary) border border-(--border) rounded-(--space-1) p-(--space-3) outline-none"
          value={formData.type}
          onChange={e => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="Light">Light</option>
          <option value="Switch">Switch (TBD)</option>
          <option value="Sensor">Sensor (TBD)</option>
        </select>
      </div>

      <Button type="submit" loading={isSubmitting} variant="primary">
        Add Device
      </Button>
    </form>
  );
};
