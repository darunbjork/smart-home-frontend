import { Link, useLocation } from "react-router-dom";
import { useHouseholds } from "../../context/HouseholdContextSetup";
import { useAuth } from "../../context/AuthContextSetup";
import type { Household } from "../../types/household.types";

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const { state: householdState, setActive, createHousehold } = useHouseholds();
  const { state: authState, logout } = useAuth();
  const user = authState.user;
  const location = useLocation();

  const handleAddHousehold = async () => {
    const name = window.prompt("Enter new household name:");
    if (!name) return;
    try {
      await createHousehold(name);
    } catch (err) {
      console.error("Failed to create workspace:", err);
    }
  };

  const handleSelect = (id: string) => {
    setActive(id);
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 shrink-0 h-full bg-(--bg-surface) border-r border-(--border) flex flex-col">
      <div className="p-(--space-6) border-b border-(--border)">
        <h2 className="text-(--text-lg) font-(--weight-bold) flex items-center gap-2">
          <span className="text-(--brand)">🏠</span> SmartHome
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-(--space-4)">
        <div className="flex justify-between items-center mb-(--space-4) px-(--space-2)">
          <span className="text-(--text-xs) uppercase tracking-widest font-(--weight-bold)">
            Workspaces
          </span>
          <button onClick={handleAddHousehold} className="text-(--brand) hover:opacity-80 text-sm font-bold">
            + New
          </button>
        </div>

        <div className="flex flex-col gap-(--space-1)">
          {householdState.households.map((h: Household) => (
            <button
              key={h._id}
              onClick={() => handleSelect(h._id)}
              className={`w-full text-left px-(--space-3) py-(--space-2) rounded-xl transition-all ${
                householdState.activeHouseholdId === h._id
                  ? "bg-(--brand) text-white shadow-lg shadow-(--brand)/20"
                  : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
              }`}
            >
              {h.name}
            </button>
          ))}
        </div>
      </nav>

      <footer className="p-4 border-t border-(--border) flex flex-col gap-2 bg-(--bg-primary)/30">
        <Link 
          to="/settings" 
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
            location.pathname === "/settings" 
              ? "bg-(--bg-surface) text-(--brand) font-bold shadow-sm" 
              : "text-(--text-secondary) hover:text-(--text-primary)"
          }`}
        >
          ⚙️ Settings
        </Link>
        
        {user && (
          <div className="mt-2 p-3 bg-(--bg-surface) border border-(--border) rounded-xl flex items-center justify-between">
            <Link to="/profile" className="flex items-center gap-3 overflow-hidden group" onClick={onClose}>
              <div className="w-8 h-8 shrink-0 bg-(--brand) rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">
                {user.username.charAt(0)}
              </div>
              <span className="text-sm font-semibold truncate text-(--text-primary)">
                {user.username}
              </span>
            </Link>
            <button 
              onClick={async () => { await logout(); window.location.href = "/login"; }}
              className="ml-2 text-xs font-bold text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        )}
      </footer>
    </aside>
  );
};
