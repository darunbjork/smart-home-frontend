import { deviceApi } from "../api/device.api";
import type { Scene } from "../types/scene.types";

export const sceneService = {
  execute: async (scene: Scene): Promise<void> => {
    const actions = scene.actions.map(action => 
      deviceApi.updateData(action.deviceId, action.data)
    );
    
    await Promise.all(actions);
  }
};