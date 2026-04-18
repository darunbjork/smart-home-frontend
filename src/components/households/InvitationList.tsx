import { useEffect, useState } from "react";
import { invitationApi } from "../../api/invitation.api";
import type { Invitation } from "../../types/invitation.types";
import { Button } from "../ui/Button";

export const InvitationList = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    let isMounted = true;
    invitationApi.getPending()
      .then((data) => {
        if (isMounted) setInvitations(data);
      })
      .catch((error) => console.error("Failed to load invitations:", error));
    return () => { isMounted = false; };
  }, []);

  const handleAction = async (token: string, action: 'accept' | 'decline') => {
    try {
      if (action === 'accept') {
        await invitationApi.accept(token);
      } else {
        await invitationApi.decline(token);
      }

      const updated = await invitationApi.getPending();
      setInvitations(updated);
    } catch (error) {
      console.error(`Action "${action}" failed for the invitation.`, error);
    }
  };

  if (invitations.length === 0) return null;

  return (
    <section className="mb-8 duration-500 animate-in fade-in slide-in-from-top-4">
      <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-(--text-secondary)">
        Pending Invitations
      </h3>
      <div className="flex flex-col gap-3">
        {invitations.map((invite) => (
          <div 
            key={invite._id} 
            className="flex items-center justify-between p-4 border rounded-xl bg-(--brand)/5 border-(--brand)/20"
          >
            <div>
              <p className="font-medium text-(--text-primary)">
                Invite to join <span className="font-bold">{invite.householdName}</span>
              </p>
              <p className="text-xs text-(--text-secondary)">From: {invite.inviterEmail}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                className="text-xs" 
                onClick={() => handleAction(invite.token, 'decline')}
              >
                Decline
              </Button>
              <Button 
                variant="primary" 
                className="px-4 py-1 text-xs" 
                onClick={() => handleAction(invite.token, 'accept')}
              >
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
