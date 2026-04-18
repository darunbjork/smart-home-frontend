import { useState } from "react";
import { useHouseholds } from "../../context/HouseholdContextSetup";
import { invitationApi } from "../../api/invitation.api";
import { Button } from "../ui/Button";

export const MemberManager = () => {
  const { state } = useHouseholds();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.activeHouseholdId || !email.trim()) return;

    setLoading(true);
    setMessage(null);
    try {
      await invitationApi.send({
        householdId: state.activeHouseholdId,
        inviteeEmail: email.trim()
      });
      setMessage({ type: 'success', text: `Invitation sent to ${email}` });
      setEmail("");
    } catch (err) {
      setMessage({ type: 'error', text: "Failed to send invitation. They might already be invited." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-8">
      <header className="mb-6">
        <h3 className="text-xl font-bold text-(--text-primary)">Household Members</h3>
        <p className="text-sm text-(--text-secondary)">Invite others to control your smart home.</p>
      </header>

      <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input 
          type="email"
          required
          placeholder="colleague@example.com"
          className="flex-1 bg-(--bg-primary) border border-(--border) rounded-xl px-4 py-2 text-(--text-primary) outline-none focus:border-(--brand) transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="primary" type="submit" loading={loading}>
          Send Invite
        </Button>
      </form>

      {message && (
        <p className={`text-sm mb-4 font-medium ${message.type === 'success' ? 'text-(--brand)' : 'text-(--error)'}`}>
          {message.text}
        </p>
      )}

      {/* List of current members would go here, mapped from state.households */}
    </div>
  );
};
