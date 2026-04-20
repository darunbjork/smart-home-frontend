// src/api/scene.api.ts
// Note: uuid is now installed, so the import should work.
import { v4 as uuidv4 } from 'uuid'; // Import uuid, it's needed for mock IDs

// Define a specific type for scene actions and export it
export interface SceneAction {
  deviceId: string;
  action: 'toggle'; // Assuming 'toggle' is the only action for now
  value: boolean;
  data: Partial<DeviceData>; // Changed from 'any' or 'unknown' to 'Partial<DeviceData>'
}

// Placeholder for DeviceData type, assuming it's defined in scene.types.ts or elsewhere
// This is to satisfy the 'Partial<DeviceData>' requirement from scene.types.ts
type DeviceData = object; // Changed from empty interface to 'object' as suggested by ESLint

// Mock Scene type for demonstration purposes, assuming it exists elsewhere
// Use the exported SceneAction type for its actions property
interface MockScene {
  _id: string;
  name: string;
  icon: string;
  active: boolean;
  household: string;
  actions: SceneAction[]; // Corrected to use the exported SceneAction[] type
}

// Mock function to simulate API call for creating a scene
const mockCreateScene = async (sceneData: { name: string; householdId: string; actions: SceneAction[]; }): Promise<MockScene> => {
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

export const sceneApi = {
  getByHousehold: async (householdId: string): Promise<MockScene[]> => {
    // Returning static data that matches the Scene type, preventing crashes/hanging
    console.log("Mock API Call: Getting scenes for household", householdId);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
    return [
      // Mock data now includes 'data: {}' to match SceneAction type with Partial<DeviceData>
      { _id: "s1", name: "Movie Night", icon: "🎬", active: false, household: householdId, actions: [{ deviceId: "d1", action: 'toggle', value: true, data: {} }] },
      { _id: "s2", name: "Focus Mode", icon: "💻", active: true, household: householdId, actions: [{ deviceId: "d2", action: 'toggle', value: false, data: {} }] },
      { _id: "s3", name: "All Lights Off", icon: "🌙", active: false, household: householdId, actions: [{ deviceId: "d3", action: 'toggle', value: false, data: {} }] }
    ];
  },
  activate: async (sceneId: string): Promise<void> => {
    console.log(`Mock API Call: Scene ${sceneId} activated`);
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate delay
  },
  // Add the create method
  create: mockCreateScene,
  // Update the execute method to use fetch
  execute: async (sceneId: string) => {
    const response = await fetch(`/api/scenes/${sceneId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to execute scene');
    // It's good practice to return something, even if it's just an empty JSON object or null.
    // If the backend guarantees no response body, response.json() might error.
    // For now, let's assume it returns JSON.
    return response.json(); 
  },
};
