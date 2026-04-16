import React, { useState } from "react";
import { useDevices } from "../../context/DeviceContext";
import { useToast } from "../../hooks/useToast";
import { aiService } from "../../services/ai.service";

export const HomebotUI = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { state, toggleDevice } = useDevices();
  const { showToast } = useToast();

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const commands = await aiService.processCommand(input, state.devices);
      for (const cmd of commands) {
        const device = state.devices.find(d => d._id === cmd.id);
        if (device && device.data.on !== (cmd.action === "on")) {
          await toggleDevice(cmd.id, device.data.on);
        }
      }
      showToast(`AI executed ${commands.length} actions`, "success");
      setInput("");
    } catch (err) {
      showToast("AI Command failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--brand)]/20 p-4 rounded-2xl mb-8">
      <form onSubmit={handleCommand} className="flex gap-4">
        <input 
          className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)]"
          placeholder="Ask Homebot... (e.g. 'Goodnight' to turn off everything)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="text-[var(--brand)] font-bold disabled:opacity-50" disabled={loading}>
          {loading ? "..." : "Ask ✨"}
        </button>
      </form>
    </div>
  );
};
