export interface SceneAction {
  deviceId: string;
  on: boolean;
  brightness?: number;
}

export interface Scene {
  _id: string;
  name: string;
  icon: string;
  household: string;
  actions: SceneAction[];
}
