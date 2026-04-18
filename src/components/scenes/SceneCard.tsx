import { useState } from "react";
import type { Scene } from "../../types/scene.types";
import { sceneService } from "../../services/scene.service";

interface SceneCardProps {
  scene: Scene;
}

export const SceneCard = ({ scene }: SceneCardProps) => {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    try {
      await sceneService.execute(scene);
    } catch (error) {
      console.error("Scene execution failed", error);
    } finally {
      setTimeout(() => setIsExecuting(false), 600);
    }
  };

  return (
    <button
      onClick={handleExecute}
      disabled={isExecuting}
      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 group
        ${isExecuting 
          ? 'bg-(--brand) border-(--brand) scale-95' 
          : 'bg-(--bg-surface) border-(--border) hover:border-(--brand)/50 hover:shadow-lg hover:shadow-(--brand)/5'
        }`}
    >
      <div className={`text-2xl transition-transform duration-500 ${isExecuting ? 'animate-spin' : 'group-hover:scale-110'}`}>
        {scene.icon || '🎬'}
      </div>
      
      <span className={`text-xs font-bold uppercase tracking-tighter transition-colors ${
        isExecuting ? 'text-white' : 'text-(--text-secondary) group-hover:text-(--brand)'
      }`}>
        {scene.name}
      </span>

      {isExecuting && (
        <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse" />
      )}
    </button>
  );
};