export const sceneApi = {
  getByHousehold: async (householdId: string) => {
    // Returning static data that matches the Scene type, preventing crashes/hanging
    return [
      { _id: "s1", name: "Movie Night", icon: "🎬", active: false, household: householdId, actions: [] },
      { _id: "s2", name: "Focus Mode", icon: "💻", active: true, household: householdId, actions: [] },
      { _id: "s3", name: "All Lights Off", icon: "🌙", active: false, household: householdId, actions: [] }
    ];
  },
  activate: async (sceneId: string) => {
    console.log(`Scene ${sceneId} activated (Mock Logic)`);
  }
};
