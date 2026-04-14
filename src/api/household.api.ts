import { api } from "./axios";
import type { Household } from "../types/household.types";

export const householdApi = {
  getAll: (): Promise<Household[]> => 
    api.get("/households").then(r => r.data),

  create: (name: string): Promise<Household> => 
    api.post("/households", { name }).then(r => r.data),

  delete: (id: string): Promise<void> => 
    api.delete(`/households/${id}`).then(r => r.data),
};
