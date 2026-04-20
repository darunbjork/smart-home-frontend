import { useEffect, useState, useMemo } from "react";
import { useHouseholds } from "../../context/HouseholdContextSetup";
import { deviceApi } from "../../api/device.api";
import { energyUtils } from "../../utils/energy.utils";
import type { Device } from "../../types/device.types";

export const EnergyChart = () => {
  const { state } = useHouseholds();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; 
    if (state.activeHouseholdId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      deviceApi.getByHousehold(state.activeHouseholdId)
        .then((data) => {
          if (isMounted) setDevices(data);
        })
        .catch(console.error)
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [state.activeHouseholdId]);

  // Derived data
  const trendData = useMemo(() => energyUtils.generateWeeklyTrend(devices), [devices]);
  const averageUsage = useMemo(() => {
    const avg = energyUtils.calculateDailyAverage(trendData);
    return isNaN(avg) ? 0 : avg;
  }, [trendData]);

  if (loading) {
    return <div className="h-64 bg-(--bg-surface) animate-pulse rounded-2xl border border-(--border)" />;
  }

  if (devices.length === 0 || trendData.every(p => p.usage === 0)) {
    return (
      <div className="h-64 bg-(--bg-surface) border border-(--border) rounded-2xl p-8 flex flex-col items-center justify-center text-center">
        <div className="mb-2 text-3xl">📊</div>
        <p className="text-(--text-primary) font-bold">No Activity Detected</p>
        <p className="text-sm text-(--text-secondary)">Add or turn on devices to track energy usage.</p>
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

      <div className="relative flex items-end justify-between h-40 gap-2">
        {trendData.map((point) => {
          // DEFENSIVE CALCULATION:
          // 1. Determine the highest usage in the set to scale correctly
          const maxUsage = Math.max(...trendData.map(p => p.usage), 1);
          // 2. Ensure bar is at least 4px (2%) high so it's visible even if usage is low
          const barHeight = Math.max((point.usage / maxUsage) * 100, 2);

          return (
            <div key={point.day} className="flex flex-col items-center flex-1 gap-2 group">
              <div 
                className="w-full bg-(--brand)/20 rounded-t-lg transition-all duration-500 group-hover:bg-(--brand) relative"
                style={{ height: `${barHeight}%` }}
              >
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-(--text-primary) text-white text-[10px] py-1 px-2 rounded absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
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
