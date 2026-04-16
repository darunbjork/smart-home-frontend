import { useState } from "react";
import { useDevices } from "../../context/DeviceContext";
import { useToast } from "../../hooks/useToast";
import { aiService } from "../../services/ai.service";

export const HomebotUI = () => {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  
  const { state, toggleDevice } = useDevices();
  const { showToast } = useToast();

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    setIsThinking(true);
    try {
      const commands = await aiService.processCommand(input, state.devices);
      
      if (commands.length === 0) {
        showToast("I couldn't find any devices matching that command.", "info");
      } else {
        // Execute all LLM-generated commands
        for (const cmd of commands) {
          const device = state.devices.find(d => d._id === cmd.id);
          if (device) {
            // Only toggle if the target state is different from the current state
            const isCurrentlyOn = Boolean(device.data.on);
            const targetIsOn = cmd.action === "on";
            
            if (isCurrentlyOn !== targetIsOn) {
               await toggleDevice(cmd.id, isCurrentlyOn); 
            }
          }
        }
        showToast(`Executed ${commands.length} commands successfully!`, "success");
      }
      setInput("");
    } catch (err) {
      showToast("The AI assistant encountered an error.", "error");
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="bg-(--bg-elevated) border border-(--brand)/30 p-4 rounded-xl shadow-inner mb-8 transition-all">
      <form onSubmit={handleCommand} className="flex items-center gap-3">
        <span className="text-xl">🤖</span>
        <input 
          type="text"
          placeholder="Ask Homebot to control your devices... (e.g., 'Turn off the lights in the kitchen')"
          className="flex-1 bg-transparent border-none outline-none text-(--text-primary) placeholder:text-(--text-secondary)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isThinking}
        />
        <button 
          type="submit"
          disabled={isThinking}
          className="text-(--brand) font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          {isThinking ? "Processing..." : "Send"}
        </button>
      </form>
    </div>
  );
};