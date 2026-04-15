export interface EnergyData {
  time: string;
  consumption: number; // in kWh
}

export const energyApi = {
  getWeeklyConsumption: async (): Promise<EnergyData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { time: "Mon", consumption: 12 },
          { time: "Tue", consumption: 15 },
          { time: "Wed", consumption: 10 },
          { time: "Thu", consumption: 18 },
          { time: "Fri", consumption: 22 }, 
          { time: "Sat", consumption: 25 }, 
          { time: "Sun", consumption: 20 },
        ]);
      }, 800); // 800ms fake network latency
    });
  }
};
