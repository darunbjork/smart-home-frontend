import { api } from "./axios";
import type { Invitation, InviteMemberDto } from "../types/invitation.types";

export const invitationApi = {
  // POST /households/invite
  send: (dto: InviteMemberDto): Promise<Invitation> => 
    api.post('/households/invite', dto).then(r => r.data),

  // GET /households/invitations
  getPending: (): Promise<Invitation[]> => 
    api.get('/households/invitations').then(r => r.data.invitations),

  // POST /households/invitations/accept
  accept: (token: string): Promise<void> => 
    api.post('/households/invitations/accept', { token }).then(r => r.data),

  // POST /households/invitations/decline
  decline: (token: string): Promise<void> => 
    api.post('/households/invitations/decline', { token }).then(r => r.data),
};
