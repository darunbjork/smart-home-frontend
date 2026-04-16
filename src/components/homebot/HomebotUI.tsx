import React, { useState } from "react";
import { useDevices } from "../../context/DeviceContext";
import { useToast } from "../../hooks/useToast";
import { aiService } from "../../services/ai.service";

export const HomebotUI = () => {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const { state, toggleDevice } = useDevices();
  const { showToast } = useToast();

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    setIsThinking(true);
    try {
      const actions = await aiService.processCommand(input, state.devices);
      
      if (actions.length === 0) {
        showToast("AI couldn't map that command to a device.", "info");
      } else {
        for (const action of actions) {
          const device = state.devices.find(d => d._id === action.id);
          // Only fire a request if the AI wants to change the state
          if (device && (device.data.on !== (action.action === "on"))) {
            // Use nullish coalescing operator to provide false if device.data.on is undefined
            await toggleDevice(device._id, device.data.on ?? false); // ✅ fixed
          }
        }
        showToast(`AI executed ${actions.length} home commands.`, "success");
      }
      setInput("");
    } catch { // ✅ Ignored err variable for ESLint warning
      showToast("AI Service Timeout. Check your Gemini Key.", "error");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="bg-(--bg-surface) border border-(--brand)/20 p-4 rounded-2xl shadow-lg mb-8 group focus-within:border-(--brand) transition-all">
      <form onSubmit={handleAISubmit} className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${isThinking ? 'bg-(--brand) animate-pulse' : 'bg-(--text-secondary)'}`} />
        <input 
          className="flex-1 bg-transparent border-none outline-none text-(--text-primary) placeholder:text-(--text-secondary)"
          placeholder="Ask Homebot... (e.g. 'Turn everything off and keep the fridge on')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isThinking}
        />
        <button 
          disabled={isThinking}
          className="px-4 py-1 text-sm font-bold text-(--brand) hover:bg-(--brand)/10 rounded-lg disabled:opacity-30"
        >
          {isThinking ? "THINKING..." : "EXECUTE ✨"}
        </button>d
      </form>
    </div>
  );
};
