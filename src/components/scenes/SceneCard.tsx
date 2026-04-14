import { useState } from "react";
import { sceneApi } from "../../api/scene.api";
import type { Scene } from "../../types/scene.types";

export const SceneCard = ({ scene }: { scene: Scene }) => {
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      await sceneApi.activate(scene._id);
      // The socket.io listener in DeviceContext will handle the 
      // visual updates for all affected devices automatically!
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <button 
      onClick={handleActivate}
      disabled={isActivating}
      className={`
        p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3
        ${isActivating 
          ? "bg-(--bg-elevated) border-(--brand) animate-pulse" 
          : "bg-(--bg-surface) border-(--border) hover:border-(--brand) active:scale-95"}
      `}
    >
      <span className="text-3xl">{scene.icon || "🎬"}</span>
      <span className="font-bold text-(--text-primary)">{scene.name}</span>
      <span className="text-xs text-(--text-secondary) uppercase">
        {scene.actions.length} Actions
      </span>
    </button>
  );
};
