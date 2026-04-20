import { v4 as uuidv4 } from 'uuid';

export interface SceneAction {
  deviceId: string;
  action: 'toggle'; 
  value: boolean;
  data: Partial<DeviceData>; 
}

type DeviceData = object

interface MockScene {
  _id: string;
  name: string;
  icon: string;
  active: boolean;
  household: string;
  actions: SceneAction[];
}

const mockCreateScene = async (sceneData: { name: string; householdId: string; actions: SceneAction[]; }): Promise<MockScene> => {
  console.log("Mock API Call: Creating scene", sceneData);
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    _id: uuidv4(),
    name: sceneData.name,
    icon: "✨", 
    active: false,
    household: sceneData.householdId,
    actions: sceneData.actions
  };
};

export const sceneApi = {
  getByHousehold: async (householdId: string): Promise<MockScene[]> => {
    console.log("Mock API Call: Getting scenes for household", householdId);
    await new Promise(resolve => setTimeout(resolve, 300)); 
    return [
      { _id: "s1", name: "Movie Night", icon: "🎬", active: false, household: householdId, actions: [{ deviceId: "d1", action: 'toggle', value: true, data: {} }] },
      { _id: "s2", name: "Focus Mode", icon: "💻", active: true, household: householdId, actions: [{ deviceId: "d2", action: 'toggle', value: false, data: {} }] },
      { _id: "s3", name: "All Lights Off", icon: "🌙", active: false, household: householdId, actions: [{ deviceId: "d3", action: 'toggle', value: false, data: {} }] }
    ];
  },
  activate: async (sceneId: string): Promise<void> => {
    console.log(`Mock API Call: Scene ${sceneId} activated`);
    await new Promise(resolve => setTimeout(resolve, 200)); 
  },
  create: mockCreateScene,
  execute: async (sceneId: string) => {
    const response = await fetch(`/api/scenes/${sceneId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to execute scene');
    return response.json(); 
  },
};
