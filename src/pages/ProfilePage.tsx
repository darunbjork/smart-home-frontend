import { useAuth } from "../context/AuthContextSetup";
import { Button } from "../components/ui/Button";

export const ProfilePage = () => {
  const { state, logout } = useAuth();
  const user = state.user;

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <header className="mb-10">
        <h1 className="text-(--text-4xl) font-(--weight-bold)">Account Settings</h1>
        <p className="text-(--text-secondary)">Manage your personal information and security.</p>
      </header>

      <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden">
        <div className="p-8 border-b border-(--border) flex items-center gap-6">
          <div className="w-20 h-20 bg-(--brand) rounded-full flex items-center justify-center text-3xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-(--text-secondary)">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Role</p>
              <p className="text-sm text-(--text-secondary)">Your permission level in the current workspace.</p>
            </div>
            <span className="px-3 py-1 bg-(--bg-primary) border border-(--border) rounded-full text-xs uppercase tracking-widest">
              {"Member"} 
            </span>
          </div>

          <hr className="border-(--border)" />

          <div className="flex justify-between items-center text-(--error)">
            <div>
              <p className="font-bold text-(--text-primary)">Logout</p>
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