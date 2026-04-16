import { useState, useEffect } from "react"; 
import { DeviceGrid } from "../components/devices/DeviceGrid"; 
import { SceneCard } from "../components/scenes/SceneCard"; 
import { sceneApi } from "../api/scene.api"; 
import type { Scene } from "../types/scene.types"; 
import { useHouseholds } from "../context/HouseholdContextSetup"; 
import { Button } from "../components/ui/Button";
import { EnergyChart } from "../components/analytics/EnergyChart";
import { ErrorBoundary } from "../components/auth/ErrorBoundary";
import { HomebotUI } from "../components/homebot/HomebotUI";


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
        <section>
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
          <DeviceGrid onAddClick={() => setIsAddModalOpen(true)} />
        </section>
      </ErrorBoundary>
      
     {isAddModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="p-8 rounded-lg bg-(--bg-secondary) border border-(--border-color)">
      <h2 className="mb-4 text-xl font-bold text-(--text-primary)">Add Device Modal</h2>
      <p className="text-(--text-secondary)">Content for adding a new device goes here...</p>
      <Button 
        variant="secondary"
        onClick={() => setIsAddModalOpen(false)}
      >
        Close
      </Button>

    </div>
  </div>
)}
    </div>
  );
};


