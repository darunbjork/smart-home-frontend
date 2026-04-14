/* Add necessary imports for sceneApi and types */
import { useState, useEffect } from "react"; // Added useEffect
import { DeviceGrid } from "../components/devices/DeviceGrid"; // Assuming this import exists
import { SceneCard } from "../components/scenes/SceneCard"; // Import SceneCard
import { sceneApi } from "../api/scene.api"; // Import sceneApi
import type { Scene } from "../types/scene.types"; // Import Scene type
import { useHouseholds } from "../context/HouseholdContextSetup"; // Assuming this hook exists

export const Dashboard = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const { state: hState } = useHouseholds();

  useEffect(() => {
    if (hState.activeHouseholdId) {
      sceneApi.getByHousehold(hState.activeHouseholdId).then(setScenes);
    }
  }, [hState.activeHouseholdId]);

  // Placeholder for modal and other dashboard elements
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Added for completeness

  return (
    <div className="flex flex-col gap-10 mx-auto max-w-7xl">
      {/* 1. Scenes Section */}
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

      {/* 2. Existing Device Section */}
      <section>
        <header className="flex items-end justify-between mb-8">
           {/* Existing header code for devices */}
           <h3 className="text-2xl font-bold text-(--text-primary)">My Devices</h3>
           <button 
             onClick={() => setIsAddModalOpen(true)} 
             className="text-sm font-semibold text-(--brand) hover:underline"
           >
             + Add Device
           </button>
        </header>
        <DeviceGrid onAddClick={() => setIsAddModalOpen(true)} />
      </section>
      
      {/* Placeholder for Modal code */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">Add Device Modal</h2>
            <p>Content for adding a new device goes here...</p>
            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 mt-4 bg-gray-300 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
