import { api } from "./axios";
import type { Member } from "../types/member.types"; // Make sure Member is importable from types

export const memberApi = {
  // The backend returns members inside the household object
  getMembers: async (householdId: string): Promise<Member[]> => { // Explicitly type return as Member[]
    const res = await api.get(`/households/${householdId}`);
    // Backend returns { household: { members: [] } }
    return res.data?.household?.members || []; // Added safe navigation and default
  },

  // Match the backend's expected body keys and flat URL
  inviteMember: (householdId: string, email: string): Promise<Member> => // Explicitly type return as Member
    api.post('/households/invite', {
      householdId,
      inviteeEmail: email // Backend expects inviteeEmail, not just email
    }).then(r => r.data), // Assuming backend returns the invited member on success
};

// Explicitly export Member type from this module to resolve TS2305
export type { Member };
