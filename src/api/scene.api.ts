import { v4 as uuidv4 } from 'uuid';

// Mock Scene type for demonstration purposes, assuming it exists elsewhere
interface MockScene {
  _id: string;
  name: string;
  icon: string;
  active: boolean;
  household: string;
  actions: any[]; // Simplified for mock
}

// Mock function to simulate API call for creating a scene
const mockCreateScene = async (sceneData: { name: string; householdId: string; actions: any[]; }): Promise<MockScene> => {
  console.log("Mock API Call: Creating scene", sceneData);
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return a mock scene object with a generated ID
  return {
    _id: uuidv4(), // Generate a unique ID
    name: sceneData.name,
    icon: "✨", // Default icon for new scenes
    active: false,
    household: sceneData.householdId,
    actions: sceneData.actions
  };
};

// Mock function to simulate API call for executing a scene
const mockExecuteScene = async (sceneId: string): Promise<void> => {
  console.log(`Mock API Call: Executing scene ${sceneId}`);
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate delay
};

export const sceneApi = {
  getByHousehold: async (householdId: string): Promise<MockScene[]> => {
    // Returning static data that matches the Scene type, preventing crashes/hanging
    console.log("Mock API Call: Getting scenes for household", householdId);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
    return [
      { _id: "s1", name: "Movie Night", icon: "🎬", active: false, household: householdId, actions: [] },
      { _id: "s2", name: "Focus Mode", icon: "💻", active: true, household: householdId, actions: [] },
      { _id: "s3", name: "All Lights Off", icon: "🌙", active: false, household: householdId, actions: [] }
    ];
  },
  activate: async (sceneId: string): Promise<void> => {
    console.log(`Mock API Call: Scene ${sceneId} activated`);
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate delay
  },
  // Add the create method
  create: mockCreateScene,
  // Add the execute method
  execute: mockExecuteScene
};
