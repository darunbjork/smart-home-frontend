import { api } from "./axios";
import type { Member } from "../types/member.types";

export const memberApi = {
  getMembers: (householdId: string): Promise<Member[]> =>
    api.get(`/households/${householdId}/members`).then(r => r.data.members),

  inviteMember: (householdId: string, email: string): Promise<Member> =>
    api.post(`/households/${householdId}/members/invite`, { email }).then(r => r.data),
};

// Exporting Member type here as it was declared locally and not exported, causing the TS error.
// If Member is meant to be exclusively from ../types/member.types, this local declaration
// and export might be removed or adjusted based on the intended structure.
// For now, ensuring it's available via export to fix the immediate TS error.
export type { Member };
