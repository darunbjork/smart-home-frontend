import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { energyApi, type EnergyData } from "../../api/energy.api";

export const EnergyChart = () => {
  const [data, setData] = useState<EnergyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    energyApi.getWeeklyConsumption().then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="h-75 w-full bg-(--bg-surface) rounded-xl border border-(--border) animate-pulse flex items-center justify-center">
        <span className="text-(--text-secondary)">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="bg-(--bg-surface) border border-(--border) p-(--space-6) rounded-(--space-3) shadow-lg animate-slide-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-(--text-primary)">Energy Consumption</h2>
        <p className="text-sm text-(--text-secondary)">Weekly usage in kWh</p>
      </div>

      <div className="w-full h-75">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Themed Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            
            {/* Themed Axes */}
            <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            
            {/* Themed Tooltip */}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-elevated)', 
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '8px'
              }}
              itemStyle={{ color: 'var(--brand)' }}
            />
            
            {/* The Chart Line/Area */}
            <Area 
              type="monotone" 
              dataKey="consumption" 
              stroke="var(--brand)" 
              fillOpacity={1} 
              fill="url(#colorConsumption)" 
            />
            
            {/* Gradient definition for the area below the line */}
            <defs>
              <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
