import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Device } from "../types/device.types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface AICommand {
  id: string;
  action: "on" | "off";
}

export const aiService = {
  processCommand: async (userPrompt: string, devices: Device[]): Promise<AICommand[]> => {
    const simplifiedContext = devices.map(d => ({
      id: d._id,
      name: d.name,
      type: d.type,
      currentState: d.data.on ? "on" : "off"
    }));

    const systemPrompt = `
      You are a Smart Home Assistant. You have access to these devices: ${JSON.stringify(simplifiedContext)}.
      The user will give you a command. 
      Return ONLY a JSON array of objects with the format: {"id": "device_id", "action": "on" | "off"}.
      If the command is unclear or no devices match, return an empty array [].
      Do not explain anything. Just return the JSON array.
    `;

    try {
      const result = await model.generateContent([systemPrompt, userPrompt]);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON if Gemini wraps it in markdown code blocks
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as AICommand[];
      }
      return [];
    } catch (e) {
      console.error("AI Parse Error:", e);
      return [];
    }
  }
};