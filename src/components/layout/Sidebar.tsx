import { useHouseholds } from "../../context/HouseholdContext";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const { state, setActive, createHousehold } = useHouseholds();
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

  return (
    <aside className="w-64 flex-shrink-0 h-full bg-[var(--bg-surface)] border-r border-[var(--border)] flex flex-col">
      <div className="p-[var(--space-6)] border-b border-[var(--border)]">
        <h2 className="text-[var(--text-lg)] font-[var(--weight-bold)] flex items-center gap-2">
          <span className="text-[var(--brand)]">🏠</span> SmartHome
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-[var(--space-4)]">
        <div className="flex justify-between items-center mb-[var(--space-4)] px-[var(--space-2)]">
          <span className="text-[var(--text-xs)] uppercase tracking-widest text-[var(--text-secondary)] font-[var(--weight-bold)]">
            My Households
          </span>
          <button
            onClick={handleAddHousehold}
            className="text-[var(--brand)] hover:opacity-80 text-sm font-bold"
          >
            + New
          </button>
        </div>

        <div className="flex flex-col gap-[var(--space-1)]">
          {state.households.map((h) => (
            <button
              key={h._id}
              onClick={() => setActive(h._id)}
              className={`
                w-full text-left px-[var(--space-3)] py-[var(--space-2)] rounded-[var(--space-2)] transition-all
                ${state.activeHouseholdId === h._id
                  ? "bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/20"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"}
              `}
            >
              {h.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Settings Link */}
      <div className="p-[var(--space-4)] flex flex-col gap-2 mt-auto">
        <Link
          to="/settings"
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            location.pathname === "/settings"
              ? "bg-[var(--bg-primary)] text-[var(--brand)] font-bold"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          ⚙️ Settings
        </Link>
        <div className="bg-[var(--bg-primary)] p-[var(--space-3)] rounded-[var(--space-2)]">
            <p className="text-[var(--text-xs)] text-[var(--text-secondary)]">Active Workspace</p>
            <p className="text-[var(--text-sm)] font-medium truncate">
                {state.households.find(h => h._id === state.activeHouseholdId)?.name || "No Household"}
            </p>
        </div>
      </div>
    </aside>
  );
};
