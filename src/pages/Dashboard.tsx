import { useState } from "react";
import { DeviceGrid } from "../components/devices/DeviceGrid";
import { Modal } from "../components/ui/Modal";
import { AddDeviceForm } from "../components/devices/AddDeviceForm";
import { Button } from "../components/ui/Button";

export const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-[var(--space-8)] animate-fade-in">
      <header className="flex justify-between items-center mb-[var(--space-10)]">
        <div>
          <h1 className="text-[var(--text-4xl)] font-[var(--weight-bold)] tracking-tight">
            Dashboard
          </h1>
          <p className="text-[var(--text-secondary)]">Manage your connected devices</p>
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Device
        </Button>
      </header>

      {/* Passing the open state to the grid so it can render its own "Add" button in empty state */}
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
