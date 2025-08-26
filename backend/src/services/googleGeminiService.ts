import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export async function generateTaskProperties(prompt: string) {
  const today = new Date().toISOString(); 
  console.log(today);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      You are a to-do list assistant. 
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
    - Do NOT include any extra text.

    Prompt: "${prompt}"
    `,
  });

  // Gemini returns text, so parse it into JSON
  const text = response.text;
  console.log(text);
  try {
    const parsed = JSON.parse(text!);
    return parsed; 
  } catch (err) {
    console.error("Failed to parse AI response:", text);
    throw new Error("AI did not return valid JSON");
  }
}

