import { useState } from "react";
import { useHouseholds } from "../context/HouseholdContext";
import { MemberManager } from "../components/households/MemberManager";
import { OwnerGuard } from "../components/auth/OwnerGuard";
import { Button } from "../components/ui/Button";

export const SettingsPage = () => {
  const { state, updateHousehold, deleteHousehold } = useHouseholds();
  const currentHousehold = state.households.find(h => h._id === state.activeHouseholdId);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentHousehold?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveRename = async () => {
    if (!editName.trim() || !state.activeHouseholdId) return;
    setIsSaving(true);
    try {
      await updateHousehold(state.activeHouseholdId, { name: editName });
      setIsEditing(false);
    } catch (err) {
      console.error("Rename failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const message = `Are you absolutely sure you want to delete "${currentHousehold?.name}"? All devices will be removed.`;
    if (window.confirm(message) && state.activeHouseholdId) {
      await deleteHousehold(state.activeHouseholdId);
    }
  };

  if (!currentHousehold) {
    return <div className="p-8 text-center text-(--text-secondary)">No active workspace found.</div>;
  }

  return (
    <div className="flex flex-col max-w-4xl gap-8 mx-auto animate-slide-up">
      <header>
        <h1 className="text-(--text-4xl) font-bold">Workspace Settings</h1>
        <p className="text-(--text-secondary)">Manage your household, members, and permissions.</p>
      </header>
      
      <section>
        <MemberManager />
      </section>

      <OwnerGuard>
        <section className="bg-(--status-offline-bg)/10 border border-(--status-offline-text)/20 p-6 rounded-xl flex flex-col gap-4">
          <h3 className="text-(--status-offline-text) font-bold text-lg">Danger Zone</h3>
          <p className="text-sm text-(--text-secondary)">Actions here are permanent.</p>
          
          {isEditing ? (
            <div className="flex items-center gap-3 bg-(--bg-primary) p-2 rounded-lg border border-(--border) max-w-md">
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none px-2 text-(--text-primary)"
                autoFocus
              />
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveRename} loading={isSaving}>Save</Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" onClick={() => { setEditName(currentHousehold.name); setIsEditing(true); }}>
                Rename Household
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Household
              </Button>
            </div>
          )}
        </section>
      </OwnerGuard>
    </div>
  );
};
