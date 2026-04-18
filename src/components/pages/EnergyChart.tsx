import { useEffect, useState, useMemo } from "react";
import { useHouseholds } from "../../context/HouseholdContextSetup";
import { deviceApi } from "../../api/device.api";
import { energyUtils } from "../../utils/energy.utils";
import type { Device } from "../../types/device.types";

export const EnergyChart = () => {
  const { state } = useHouseholds();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.activeHouseholdId) {
      deviceApi.getByHousehold(state.activeHouseholdId)
        .then(setDevices)
        .catch((err) => {
          console.error("Failed to fetch devices for energy chart:", err);
          setError("Could not load device data.");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [state.activeHouseholdId]);

  const trendData = useMemo(() => energyUtils.generateWeeklyTrend(devices), [devices]);
  const averageUsage = useMemo(() => energyUtils.calculateDailyAverage(trendData), [trendData]);

  if (loading) {
    return <div className="h-64 bg-(--bg-surface) animate-pulse rounded-2xl border border-(--border)" />;
  }

  if (error) {
    return (
      <div className="bg-(--bg-surface) border border-(--error)/30 rounded-2xl p-8 text-center">
        <p className="text-(--error)">{error}</p>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-8 text-center">
        <p className="text-(--text-secondary)">No devices added yet.</p>
        <p className="text-sm text-(--text-secondary)">Add a light or switch to see energy estimates.</p>
      </div>
    );
  }

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-8 shadow-sm">
      <header className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-(--text-primary)">Energy Consumption</h3>
          <p className="text-sm text-(--text-secondary)">Weekly household usage in kWh</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-(--brand)">{averageUsage} kWh</p>
          <p className="text-[10px] uppercase tracking-tighter text-(--text-secondary)">Daily Avg</p>
        </div>
      </header>

      <div className="flex items-end justify-between h-40 gap-2">
        {trendData.map((point) => (
          <div key={point.day} className="flex flex-col items-center flex-1 gap-2 group">
            <div 
              className="w-full bg-(--brand)/20 rounded-t-lg transition-all duration-500 group-hover:bg-(--brand)"
              style={{ height: `${Math.min(100, (point.usage / (averageUsage * 2)) * 100)}%` }}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-(--text-primary) text-white text-[10px] py-1 px-2 rounded absolute -translate-y-8">
                {point.usage}
              </div>
            </div>
            <span className="text-xs font-medium text-(--text-secondary)">{point.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
