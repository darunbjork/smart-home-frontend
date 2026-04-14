import { api } from "./axios";

export interface Member {
  _id:   string;
  email: string;
  role:  "owner" | "member";
}

export const memberApi = {
  getMembers: (householdId: string): Promise<Member[]> => 
    api.get(`/households/${householdId}/members`).then(r => r.data),

  inviteMember: (householdId: string, email: string): Promise<void> => 
    api.post(`/households/${householdId}/invite`, { email }).then(r => r.data),

  removeMember: (householdId: string, userId: string): Promise<void> => 
    api.delete(`/households/${householdId}/members/${userId}`).then(r => r.data),
};
