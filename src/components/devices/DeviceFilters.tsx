import { useState, useEffect } from "react";

interface DeviceFiltersProps {
  onFilterChange: (filters: { search: string; type: string }) => void;
}

export const DeviceFilters = ({ onFilterChange }: DeviceFiltersProps) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  // Debounce effect: Wait 300ms after typing stops before triggering the search
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({ search, type });
    }, 300);

    return () => clearTimeout(handler);
  }, [search, type, onFilterChange]);

  return (
    <div className="flex flex-wrap gap-[var(--space-4)] mb-[var(--space-8)]">
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Search devices by name..."
          className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--space-2)] px-[var(--space-4)] py-[var(--space-2)] focus:border-[var(--brand)] outline-none transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--space-2)] px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-secondary)] outline-none focus:border-[var(--brand)]"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="light">Lights</option>
        <option value="switch">Switches</option>
        <option value="sensor">Sensors</option>
      </select>
    </div>
  );
};