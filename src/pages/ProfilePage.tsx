import { useAuth } from "../context/AuthContextSetup";
import { useHouseholds } from "../context/HouseholdContextSetup"; 
import { Button } from "../components/ui/Button";

interface MemberRecord {
  userId: string;
  role: string;
}

interface AppUser {
  id?: string;
  _id?: string;
  username: string;
  email: string;
}

export const ProfilePage = () => {
  const { state: authState, logout } = useAuth();
  const { state: hState } = useHouseholds();
  
  const user = authState.user as AppUser | null;
  
  if (!user) return null;

  const userId = user._id || user.id;
  const currentHousehold = hState.households.find(h => h._id === hState.activeHouseholdId);
  const members = currentHousehold?.members as MemberRecord[] | undefined;
  const myMemberRecord = members?.find((m) => m.userId === userId);
  
  const userRole = myMemberRecord?.role || (currentHousehold?.owner === userId ? 'Owner' : 'Member');

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <header className="mb-10">
        <h1 className="text-(--text-4xl) font-bold">Account Settings</h1>
        <p className="text-(--text-secondary)">Manage your personal information and security.</p>
      </header>

      <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-(--border) flex items-center gap-6">
          <div className="w-20 h-20 bg-(--brand) text-white rounded-full flex items-center justify-center text-3xl font-bold uppercase">
            {user.username.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-(--text-primary)">{user.username}</h2>
            <p className="text-(--text-secondary)">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-(--text-primary)">Current Role</p>
              <p className="text-sm text-(--text-secondary)">Your permission level in {currentHousehold?.name || 'this workspace'}.</p>
            </div>
            <span className={`px-3 py-1 border rounded-full text-xs uppercase tracking-widest font-bold ${
              userRole.toLowerCase() === 'owner' 
                ? 'bg-(--brand)/10 text-(--brand) border-(--brand)/20' 
                : 'bg-(--bg-primary) text-(--text-secondary) border-(--border)'
            }`}>
              {userRole}
            </span>
          </div>

          <hr className="border-(--border)" />

          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-(--error)">Logout</p>
              <p className="text-sm text-(--text-secondary)">Sign out of your account on this device.</p>
            </div>
            <Button variant="secondary" onClick={logout}> 
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
