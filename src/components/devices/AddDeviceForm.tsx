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
      });
      await refreshDevices();
      onSuccess();
    } catch (err) {
      console.error("Failed to create device", err);
      // In a real app, you'd handle errors more gracefully, e.g., show a toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-6)]">
      <div className="flex flex-col gap-[var(--space-2)]">
        <label className="text-[var(--text-sm)] text-[var(--text-secondary)]">Device Name</label>
        <input 
          autoFocus
          required
          className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--space-1)] p-[var(--space-3)] outline-none focus:border-[var(--brand)]"
          placeholder="e.g. Kitchen Chandelier"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-[var(--space-2)]">
        <label className="text-[var(--text-sm)] text-[var(--text-secondary)]">Device Type</label>
        <select 
          className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--space-1)] p-[var(--space-3)] outline-none"
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
