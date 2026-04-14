import { useHouseholds } from "../context/HouseholdContext";
import { MemberManager } from "../components/households/MemberManager";
import { OwnerGuard } from "../components/auth/OwnerGuard";
import { Button } from "../components/ui/Button";

export const SettingsPage = () => {
  const { state, updateHousehold, deleteHousehold } = useHouseholds();
  const currentHousehold = state.households.find(h => h._id === state.activeHouseholdId);

  const handleRename = () => {
    const newName = window.prompt("Enter new name:", currentHousehold?.name);
    if (newName && state.activeHouseholdId) {
      updateHousehold(state.activeHouseholdId, { name: newName });
    }
  };

  return (
    <div className="flex flex-col max-w-4xl gap-8 mx-auto animate-slide-up">
      <header>
        <h1 className="text-(--text-4xl) font-(--weight-bold)">Workspace Settings</h1>
        <p className="text-(--text-secondary)">Manage your household, members, and permissions.</p>
      </header>

      {/* Member Management Section */}
      <section>
        <MemberManager />
      </section>

      {/* Danger Zone */}
      <OwnerGuard>
        <section className="bg-(--status-offline-bg)/10 border border-(--status-offline-text)/20 p-6 rounded-xl flex flex-col gap-4">
          <h3 className="text-(--status-offline-text) font-bold text-lg">Danger Zone</h3>
          <p className="text-sm text-(--text-secondary)">
            Actions here are permanent. Please be certain before proceeding.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" onClick={handleRename}>
              Rename Household
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => state.activeHouseholdId && deleteHousehold(state.activeHouseholdId)}
            >
              Delete Household
            </Button>
          </div>
        </section>
      </OwnerGuard>
    </div>
  );
};
