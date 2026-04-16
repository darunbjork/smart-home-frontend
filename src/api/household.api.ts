import { api } from "./axios";
import type { Household } from "../types/household.types";

export const householdApi = {
  getAll: (): Promise<Household[]> => 
    api.get("/households").then(r => r.data.households),

  create: (name: string): Promise<Household> => 
    api.post("/households", { name }).then(r => r.data),

  update: (id: string, updates: Partial<{name: string}>): Promise<void> =>
    api.put(`/households/${id}`, updates).then(r => r.data),

  remove: (id: string): Promise<void> =>
    api.delete(`/households/${id}`).then(r => r.data),
};

