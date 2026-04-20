import { useState } from "react";
import { sceneApi } from "../../api/scene.api";
import type { Scene } from "../../types/scene.types";

export const SceneCard = ({ scene }: { scene: Scene }) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'success'>('idle');

  const handleExecute = async () => {
    setStatus('running');
    try {
      await sceneApi.execute(scene._id);
      setStatus('success');
      // Reset to idle after showing success state
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <button
      onClick={handleExecute}
      disabled={status === 'running'}
      className={`group relative p-5 rounded-2xl border transition-all text-left w-full ${
        status === 'running' 
          ? "border-(--brand) bg-(--brand)/5 ring-2 ring-(--brand)/20" 
          : "border-(--border) bg-(--bg-surface) hover:border-(--brand) active:scale-95"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl transition-colors ${
          status === 'success' ? "bg-green-500/10" : "bg-(--bg-primary)"
        }`}>
          <span className="text-xl">
            {status === 'success' ? "✅" : "🎬"}
          </span>
        </div>
        {status === 'running' && (
          <div className="w-5 h-5 border-2 border-(--brand) border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      <h4 className="font-bold text-(--text-primary) mb-1">{scene.name}</h4>
      <p className="text-xs text-(--text-secondary)">
        {scene.actions.length} commands ready
      </p>

      {/* Visual Feedback Overlay */}
      {status === 'running' && (
        <div className="absolute inset-0 bg-(--brand)/5 animate-pulse rounded-2xl" />
      )}
    </button>
  );
};