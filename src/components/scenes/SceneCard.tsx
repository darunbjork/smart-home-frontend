import { useState } from "react";
import { sceneApi } from "../../api/scene.api";
import type { Scene } from "../../types/scene.types";

export const SceneCard = ({ scene }: { scene: Scene }) => { 
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await sceneApi.execute(scene._id); 
    } catch (err) {
      console.error("Failed to fire scene:", err);
    } finally {
      setTimeout(() => setIsExecuting(false), 600);
    }
  };

  return (
    <button
      onClick={handleExecute}
      disabled={isExecuting}
      className={`relative overflow-hidden group p-6 rounded-2xl border transition-all text-left ${
        isExecuting 
          ? "border-(--brand) bg-(--brand)/5 scale-95" 
          : "border-(--border) bg-(--bg-surface) hover:border-(--brand) hover:shadow-md active:scale-95"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl transition-transform group-hover:scale-110">
          {isExecuting ? "⚡" : scene.icon || "🎬"}
        </span>
        {isExecuting && (
          <div className="w-4 h-4 border-2 border-(--brand) border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      
      <h4 className="font-bold text-(--text-primary)">{scene.name}</h4>
      <p className="text-xs text-(--text-secondary) mt-1">
        {scene.actions.length} devices configured
      </p>
      
      {isExecuting && (
        <div className="absolute bottom-0 left-0 h-1 bg-(--brand) animate-progress-fast" />
      )}
    </button>
  );
};