export interface Invitation {
  _id: string;
  householdId: string;
  householdName: string;
  inviterEmail: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  token: string;
  createdAt: string;
}

export interface InviteMemberDto {
  householdId: string;
  inviteeEmail: string;
}
