import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Device } from "../types/device.types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface AICommand {
  id: string;
  action: "on" | "off";
}

export const aiService = {
  processCommand: async (userPrompt: string, devices: Device[]): Promise<AICommand[]> => {
    const context = devices.map(d => ({ id: d._id, name: d.name, status: d.data.on ? 'on' : 'off' }));
    
    const systemPrompt = `
      Context: ${JSON.stringify(context)}
      User Command: "${userPrompt}"
      Task: Return a JSON array of actions. 
      Format: [{"id": "device_id", "action": "on" | "off"}]
      Only return the JSON array. No text.
    `;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();
    
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned) as AICommand[];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return [];
    }
  }
};
