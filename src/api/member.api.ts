import { api } from "./axios";
import type { Member } from "../types/member.types"; // Corrected import path

export const memberApi = {
  getMembers: (householdId: string): Promise<Member[]> => 
    api.get(`/households/${householdId}/members`).then(r => r.data.members),
};
