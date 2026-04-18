import type { Device } from "../types/device.types";

export interface EnergyDataPoint {
  day: string;
  usage: number;
}

export const energyUtils = {
  generateWeeklyTrend: (devices: Device[]): EnergyDataPoint[] => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const baseUsage = devices.filter(d => d.type === 'light' || d.type === 'switch').length * 1.5;

    return days.map((day) => ({
      day,
      usage: parseFloat((baseUsage * (0.8 + Math.random() * 0.4)).toFixed(1))
    }));
  },

  calculateDailyAverage: (data: EnergyDataPoint[]): number => {
    if (data.length === 0) return 0;
    const total = data.reduce((acc, curr) => acc + curr.usage, 0);
    return parseFloat((total / data.length).toFixed(1));
  }
};
