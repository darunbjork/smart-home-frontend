import React, { useState } from "react";
import { useDevices } from "../../context/DeviceContext";
import { useToast } from "../../hooks/useToast";
import { aiService } from "../../services/ai.service";

export const HomebotUI = () => {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const { state, toggleDevice } = useDevices();
  const { showToast } = useToast();

  const normalizeCommand = (cmd: string) => {
    let spaced = cmd.replace(/([a-z])([A-Z])/g, '$1 $2');
    spaced = spaced.replace(/(turn)(on|off)/gi, '$1 $2');
    
    spaced = spaced.replace(/(livingroom)/gi, 'living room');
    spaced = spaced.replace(/(bedroom)/gi, 'bedroom');
    spaced = spaced.replace(/(kitchen)/gi, 'kitchen');
    // -----------------------------------------

    spaced = spaced.replace(/\b(the|in|my|all|light|lights)\b/gi, ' $1 ');
    spaced = spaced.replace(/\s+/g, ' ').trim();
    return spaced;
  };

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    if (state.devices.length === 0) {
      showToast("Devices are still loading. Please wait a moment.", "info");
      return;
    }

    setIsThinking(true);
    try {
      const processedPrompt = normalizeCommand(input);
      const actions = await aiService.processCommand(processedPrompt, state.devices);
      
      if (actions.length === 0) {
        showToast("AI couldn't map that command to a device.", "info");
      } else {
        for (const action of actions) {
          const device = state.devices.find(d => d._id === action.id);
          if (device && (device.data.on !== (action.action === "on"))) {
            await toggleDevice(device._id, device.data.on ?? false);
          }
        }
        showToast(`AI executed ${actions.length} home commands.`, "success");
      }
      setInput("");
    } catch (err: unknown) {
  console.error("AI service error:", err);
  // Safely extract error message, checking for common patterns like Axios errors
  let errorMessage = "AI Service unavailable. Check console.";
  if (typeof err === 'object' && err !== null) {
    // Safely access nested properties, similar to optional chaining logic
    const errObj = err as { response?: { data?: { message?: string } }; message?: string };
    if (errObj.response?.data?.message) {
      errorMessage = errObj.response.data.message;
    } else if (errObj.message) {
      errorMessage = errObj.message;
    }
  }
  showToast(errorMessage, "error");
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
        </button>
      </form>
    </div>
  );
};