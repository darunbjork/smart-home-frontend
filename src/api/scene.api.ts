import { api } from "./axios";
import type { Scene } from "../types/scene.types";

export const sceneApi = {
  getByHousehold: (householdId: string): Promise<Scene[]> => 
    api.get(`/households/${householdId}/scenes`).then(r => r.data.scenes), // * Extract array

  activate: (sceneId: string): Promise<void> => 
    api.post(`/scenes/${sceneId}/activate`).then(r => r.data),
    
  create: (data: Partial<Scene>): Promise<Scene> => 
    api.post("/scenes", data).then(r => r.data),
};
