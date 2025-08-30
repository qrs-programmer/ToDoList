// backend/src/routes/ai.ts
import express from "express";
import { generateTaskProperties} from "../services/googleGeminiService";
import { chatHistoryMap } from "../store/chatHistory";

const router = express.Router();

router.post("/", async (req: any, res: any) => {
  try {
    const { userId, prompt } = req.body;

    if (!userId || !prompt){
      return res.status(400).json({error:"Missing userId or prompt"});
    }
    const today = new Date().toISOString(); 
    const systemRules = `
      You are a to-do list assistant. 
      This prompt is a system configuration prompt, not an actually user prompt.
    Convert the following prompt into a JSON object with exactly these fields:
    - title: a short title for the task
    - description: a short description of the task
    - timeBlock (optional): an object with the following structure
        {
          "start": ISO 8601 date string (example: "2025-08-24T14:00:00Z"),
          "end": ISO 8601 date string,
          "duration": number of minutes between start and end
        }

    RULES:
    - Only include "timeBlock" if the prompt contains explicit or implied time information (e.g., "tomorrow at 5pm", "for 2 hours", "every Monday").
    - Today's date is ${today}, use this as reference for when user says "tomorrow", "yesterday", "next week", or any phrase referencing relative time
    - Default "duration" to 60 minutes if prompt does not contain explicit or implied duration information
    - If there is no time mentioned, do NOT include the "timeBlock" field at all.
    - Respond ONLY with valid JSON.
    - Do NOT include markdown formatting.
    - Do NOT include code fences (\`\`\`).
    - Do NOT include any extra text.`

    if (!chatHistoryMap.has(userId)) {
      chatHistoryMap.set(userId, [
        {role:"user", parts: [{text: systemRules}]},
      ])
    }

    const history = chatHistoryMap.get(userId)!;
    console.log(history);
    history.push({ role: "user", parts: [{text: prompt}] });
    const response = await generateTaskProperties(history, userId);
    history.push({ role: "model", parts: [{text: response.confirmationMessage}] });
    res.json({ history, response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI parsing failed" });
  }
});

export default router;
