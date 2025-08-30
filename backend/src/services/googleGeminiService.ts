import { GoogleGenAI } from "@google/genai";
import Task from "../models/Task";

const ai = new GoogleGenAI({});

interface Chat {
  role: string,
  parts: [{ text: string }]
}

export async function generateTaskProperties(history: Chat[], userId: string) {
  const today = new Date().toISOString(); 
  console.log(today);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: history,
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
    
    return {
    confirmationMessage: "⚠️ AI response was not valid JSON",
    task: null,
  };
  }
}

