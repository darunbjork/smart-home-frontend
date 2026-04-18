import React, { useState } from "react";
import { useHouseholds } from "../../context/HouseholdContextSetup";
import { deviceApi } from "../../api/device.api";
import { Button } from "../ui/Button";
import { type DeviceType } from "../../types/device.types";

interface AddDeviceFormProps {
  onSuccess: () => void;
}

const DEVICE_TYPES: { value: DeviceType; label: string }[] = [
  { value: "light", label: "Smart Light" },
  { value: "switch", label: "Power Switch" },
  { value: "sensor", label: "Motion Sensor" },
  { value: "thermostat", label: "Thermostat" },
];

export const AddDeviceForm = ({ onSuccess }: AddDeviceFormProps) => {
  const { state } = useHouseholds();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "light" as DeviceType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.activeHouseholdId) return;

    setLoading(true);
    try {
      await deviceApi.create({
        name: formData.name,
        type: formData.type,
        household: state.activeHouseholdId,
        data: formData.type === "light" || formData.type === "switch" ? { on: false } : {},
        status: "online",
        owner: ""
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create device", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-(--text-secondary)">Device Name</label>
        <input
          required
          type="text"
          placeholder="e.g. Living Room Lamp"
          className="bg-(--bg-primary) border border-(--border) rounded-xl p-3 focus:border-(--brand) outline-none transition-all"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-(--text-secondary)">Device Type</label>
        <select
          className="bg-(--bg-primary) border border-(--border) rounded-xl p-3 focus:border-(--brand) outline-none transition-all appearance-none"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as DeviceType })}
        >
          {DEVICE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <Button type="submit" loading={loading} variant="primary" className="mt-2">
        Pair Device
      </Button>
    </form>
  );
};
