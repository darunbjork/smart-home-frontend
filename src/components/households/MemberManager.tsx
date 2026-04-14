import { useState, useEffect, useCallback } from "react";
import { memberApi, type Member } from "../../api/member.api";
import { useHouseholds } from "../../context/HouseholdContext";
import { OwnerGuard } from "../auth/OwnerGuard";
import { Button } from "../ui/Button";

export const MemberManager = () => {
  const { state } = useHouseholds();
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!state.activeHouseholdId) return;
    const data = await memberApi.getMembers(state.activeHouseholdId);
    setMembers(data);
  }, [state.activeHouseholdId]);

  useEffect(() => { fetchMembers(); }, [state.activeHouseholdId, fetchMembers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.activeHouseholdId) return;
    setLoading(true);
    try {
      await memberApi.inviteMember(state.activeHouseholdId, email);
      setEmail("");
      fetchMembers();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-(--bg-surface) p-6 rounded-xl border border-(--border)">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Household Members</h2>
        <OwnerGuard>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address..."
              className="bg-(--bg-primary) border border-(--border) rounded-lg px-3 py-1 text-sm outline-none focus:border-(--brand)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button size="sm" loading={loading}>Invite</Button>
          </form>
        </OwnerGuard>
      </header>

      <div className="divide-y divide-(--border)">
        {members.map(m => (
          <div key={m._id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{m.email}</p>
              <p className="text-xs text-(--text-secondary) uppercase">{m.role}</p>
            </div>
            {/* Owners see a delete button for anyone who isn't them */}
            <OwnerGuard>
              {m.role !== "owner" && (
                <button className="text-(--error) text-sm hover:underline">Remove</button>
              )}
            </OwnerGuard>
          </div>
        ))}
      </div>
    </div>
  );
};
