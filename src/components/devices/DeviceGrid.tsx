import { useContext, useState, useMemo } from "react";
import { DeviceContext } from "../../context/DeviceContext";
import { DeviceCard } from "./DeviceCard";
import { Button } from "../ui/Button";
import { DeviceFilters } from "./DeviceFilters";

interface DeviceGridProps {
  onAddClick: () => void;
}

export const DeviceGrid = ({ onAddClick }: DeviceGridProps) => {
  const deviceCtx = useContext(DeviceContext);
  const [filters, setFilters] = useState({ search: "", type: "all" });
  
  const { devices = [], isLoading = false } = deviceCtx?.state || {};

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch = device.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === "all" || device.type.toLowerCase() === filters.type;
      return matchesSearch && matchesType;
    });
  }, [devices, filters]);

  if (!deviceCtx) {
    return null; // Or some fallback UI
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-6)">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-(--bg-surface) border border-(--border) rounded-(--space-3) animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-(--space-16) border-2 border-dashed border-(--border) rounded-(--space-4) text-center bg-(--bg-surface)/50">
        <div className="w-16 h-16 bg-(--bg-primary) rounded-full flex items-center justify-center mb-4 border border-(--border)">
           <span className="text-2xl text-(--text-secondary)">🔌</span>
        </div>
        <h3 className="text-(--text-xl) font-(--weight-bold) mb-2">No devices found</h3>
        <p className="text-(--text-secondary) mb-6 max-w-xs mx-auto">
          Your home is a bit quiet. Connect your first smart light or sensor to get started.
        </p>
        <Button variant="secondary" onClick={onAddClick}>
          Connect Your First Device
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DeviceFilters onFilterChange={setFilters} />

      {filteredDevices.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-(--border) rounded-xl bg-(--bg-surface)/30">
          <p className="text-(--text-secondary)">No devices match your search criteria.</p>
          <button 
            onClick={() => setFilters({ search: "", type: "all" })}
            className="text-(--brand) text-sm mt-2 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--space-6) animate-slide-up">
          {filteredDevices.map((device) => (
            <DeviceCard key={device._id} device={device} />
          ))}
        </div>
      )}
    </div>
  );
};