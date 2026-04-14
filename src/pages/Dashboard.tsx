import { useState } from "react";
import { useHouseholds } from "../context/HouseholdContext";
import { DeviceGrid } from "../components/devices/DeviceGrid";
import { Modal } from "../components/ui/Modal";
import { AddDeviceForm } from "../components/devices/AddDeviceForm";
import { Button } from "../components/ui/Button";

export const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { state: hState } = useHouseholds();
  
  // Find the current household object to get its name
  const currentHousehold = hState.households.find(h => h._id === hState.activeHouseholdId);

  return (
    <div className="mx-auto max-w-7xl animate-fade-in">
      <header className="flex justify-between items-end mb-(--space-10)">
        <div>
          <h1 className="text-(--text-4xl) font-(--weight-bold) tracking-tight">
            {currentHousehold?.name || "Select a Household"}
          </h1>
          <p className="text-(--text-secondary)">
            {hState.activeHouseholdId ? "Manage your connected devices" : "Choose a workspace from the sidebar to begin"}
          </p>
        </div>
        
        <Button 
          variant="primary" 
          disabled={!hState.activeHouseholdId} // Prevent adding devices to nothing
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Device
        </Button>
      </header>

      <DeviceGrid onAddClick={() => setIsAddModalOpen(true)} />

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Device"
      >
        <AddDeviceForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};
