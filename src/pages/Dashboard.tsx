import { useState, useEffect } from "react"; 
import { AddDeviceForm } from "../components/devices/AddDeviceForm";
import { DeviceGrid } from "../components/devices/DeviceGrid"; 
import { SceneCard } from "../components/scenes/SceneCard"; 
import { sceneApi } from "../api/scene.api"; 
import type { Scene } from "../types/scene.types"; 
import { useHouseholds } from "../context/HouseholdContextSetup"; 
import { Button } from "../components/ui/Button";
import { EnergyChart } from "../components/analytics/EnergyChart";
import { ErrorBoundary } from "../components/auth/ErrorBoundary";
import { HomebotUI } from "../components/homebot/HomebotUI";
import { InvitationList } from "../components/households/InvitationList"; // Import InvitationList

export const Dashboard = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const { state: hState } = useHouseholds();

  useEffect(() => {
    if (hState.activeHouseholdId) {
      sceneApi.getByHousehold(hState.activeHouseholdId).then(setScenes);
    }
  }, [hState.activeHouseholdId]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-10 mx-auto max-w-7xl">
      
      {/* Display InvitationList at the top if there are pending invites */}
      <InvitationList />

      <section>
        <HomebotUI />
      </section>
      {scenes.length > 0 && (
        <section className="animate-fade-in">
          <h2 className="text-sm font-bold uppercase tracking-widest text-(--text-secondary) mb-4">
            Quick Scenes
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {scenes.map(scene => (
              <SceneCard key={scene._id} scene={scene} />
            ))}
          </div>
        </section>
      )}

      <ErrorBoundary>
        <section className="h-87.5 w-full">
          <EnergyChart />
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <section>
          <header className="flex items-end justify-between mb-8">
             <h3 className="text-2xl font-bold text-(--text-primary)">My Devices</h3>
             <Button 
               variant="ghost" 
               onClick={() => setIsAddModalOpen(true)} 
               className="text-sm font-semibold text-(--brand) hover:underline"
             >
               + Add Device
             </Button>
          </header>
          <DeviceGrid />
        </section>
      </ErrorBoundary>
      
     {isAddModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md bg-(--bg-surface) border border-(--border) rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
          <div className="p-8">
            <header className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-(--text-primary)">New Device</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-(--text-secondary) hover:text-(--text-primary) transition-colors"
              >
                ✕
              </button>
            </header>

            <AddDeviceForm onSuccess={() => setIsAddModalOpen(false)} />
            
            <div className="mt-6 pt-6 border-t border-(--border)">
              <button 
                className="w-full py-2 text-sm text-(--text-secondary) hover:text-(--text-primary) font-medium transition-colors"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel and Return
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};
