import { useState, useEffect, useMemo } from "react";
import { useHouseholds } from "../../context/HouseholdContextSetup";
import { deviceApi } from "../../api/device.api";
import { energyUtils } from "../../utils/energy.utils";
import type { Device } from "../../types/device.types";

export const EnergyChart = () => {
  const { state } = useHouseholds();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.activeHouseholdId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      deviceApi.getByHousehold(state.activeHouseholdId)
        .then(setDevices)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [state.activeHouseholdId]);

  // Fix: Use useMemo instead of useEffect/useState to avoid cascading renders
  const trendData = useMemo(() => energyUtils.generateWeeklyTrend(devices), [devices]);
  
  const averageUsage = useMemo(() => {
    if (trendData.length === 0) return 0;
    const totalUsage = trendData.reduce((sum, point) => sum + point.usage, 0);
    return parseFloat((totalUsage / trendData.length).toFixed(1));
  }, [trendData]);

  if (loading) return <div className="h-64 bg-(--bg-surface) animate-pulse rounded-2xl border border-(--border)" />;

  if (devices.length === 0) {
    return (
      <div className="h-64 bg-(--bg-surface) border border-(--border) rounded-2xl p-8 flex items-center justify-center text-center">
        <p className="text-(--text-secondary)">No device data available for this workspace.</p>
      </div>
    );
  }

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-8 shadow-sm h-full">
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
        {trendData.map((point) => {
          // Fix: Ensure we don't divide by zero and provide a minimum scale
          const maxScale = averageUsage > 0 ? averageUsage * 2 : 1;
          const barHeight = Math.min((point.usage / maxScale) * 100, 100);

          return (
            <div key={point.day} className="relative flex flex-col items-center flex-1 gap-2 group">
              <div 
                className="w-full bg-(--brand)/20 rounded-t-lg transition-all duration-500 group-hover:bg-(--brand)"
                style={{ height: `${Math.max(barHeight, 5)}%` }} // Minimum 5% height so bars are always visible
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-(--text-primary) text-white text-[10px] py-1 px-2 rounded absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                  {point.usage} kWh
                </div>
              </div>
              <span className="text-xs font-medium text-(--text-secondary)">{point.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
