import { api } from "./axios";
import type { Member } from "../types/member.types";

export const memberApi = {
  getMembers: async (householdId: string): Promise<Member[]> => {
    const res = await api.get(`/households/${householdId}`);
    return res.data?.household?.members || [];
  },

  inviteMember: (householdId: string, email: string): Promise<Member> =>
    api.post('/households/invite', {
      householdId: householdId,
      inviteeEmail: email
    }).then(r => r.data),
};

// Explicitly export Member type from this module to resolve TS2459
export type { Member };
