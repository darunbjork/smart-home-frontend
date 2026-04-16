import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Device } from "../types/device.types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface AISmartAction {
  id: string;
  action: "on" | "off";
}

export const aiService = {
  processCommand: async (prompt: string, devices: Device[]): Promise<AISmartAction[]> => {
    const deviceContext = devices.map(d => ({
      id: d._id,
      name: d.name,
      status: d.data.on ? "on" : "off"
    }));

    const systemInstruction = `
      Current Home State: ${JSON.stringify(deviceContext)}
      User Input: "${prompt}"
      Requirement: Return a JSON array of actions. Format: [{"id": string, "action": "on" | "off"}]
      Constraint: Only return the JSON. No conversational text.
    `;

    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();

    try {
      const jsonMatch = responseText.match(/\[.*\]/s);
      if (!jsonMatch) return [];
      return JSON.parse(jsonMatch[0]) as AISmartAction[];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.error("Strict Typing Error: AI returned invalid JSON structure.");
      return [];
    }
  }
};
