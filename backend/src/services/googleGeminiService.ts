import { GoogleGenAI } from "@google/genai";
import Task from "../models/Task";

const ai = new GoogleGenAI({});

interface Chat {
  role: string,
  parts: [{ text: string }]
}

export async function generateTaskProperties(prompt: string, userId: string) {

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;
  console.log(text);
  try {
    let parsed = JSON.parse(text!);
    parsed.userId = userId;
    const task = new Task(parsed);
    await task.save();
    return {
    confirmationMessage: "✅ Task parsed successfully",
    task: parsed,
  };
  } catch (err) {
    console.error("Failed to parse AI response:", text);
    throw new Error("AI did not return valid JSON");
  }
}

