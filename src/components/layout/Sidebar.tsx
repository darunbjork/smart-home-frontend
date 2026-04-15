import { useHouseholds } from "../../context/HouseholdContextSetup";
import { Link, useLocation } from "react-router-dom";
import type { Household } from "../../types/household.types";
import { useAuth } from "../../context/AuthContextSetup"; 

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const { state: householdState, setActive, createHousehold } = useHouseholds();
  const { state: authState } = useAuth();
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
            My Households
          </span>
          <button
            onClick={handleAddHousehold}
            className="text-(--brand) hover:opacity-80 text-sm font-bold"
          >
            + New
          </button>
        </div>

        <div className="flex flex-col gap-(--space-1)">
          {householdState.households.map((h: Household) => (
            <button
              key={h._id}
              onClick={() => handleSelect(h._id)}
              className={`
                w-full text-left px-(--space-3) py-(--space-2) rounded-(--space-2) transition-all
                ${householdState.activeHouseholdId === h._id
                  ? "bg-(--brand) text-white shadow-lg shadow-(--brand)/20"
                  : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"}
              `}
            >
              {h.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-(--space-4) flex flex-col gap-2 mt-auto">
        <Link
          to="/settings"
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            location.pathname === "/settings"
              ? "bg-(--bg-primary) text-(--brand) font-bold"
              : "text-(--text-secondary) hover:text-(--text-primary)"
          }`}
        >
          ⚙️ Settings
        </Link>
        <div className="bg-(--bg-primary) p-(--space-3) rounded-(--space-2)">
            <p className="text-(--text-secondary)">Active Workspace</p>
            <p className="text-(--text-sm) font-medium truncate">
                {householdState.households.find((h: Household) => h._id === householdState.activeHouseholdId)?.name || "No Household"}
            </p>
        </div>

        {user && (
          <Link 
            to="/profile" 
            className="flex items-center gap-3 p-2 hover:bg-(--bg-primary) rounded-lg transition-colors group"
            onClick={onClose}
          >
            <div className="w-8 h-8 bg-(--brand) rounded-full flex items-center justify-center text-xs font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-(--text-secondary) group-hover:text-(--text-primary)">
              My Account
            </span>
          </Link>
        )}
      </div>
    </aside>
  );
};
