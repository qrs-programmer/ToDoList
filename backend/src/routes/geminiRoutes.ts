// backend/src/routes/ai.ts
import express from "express";
import { generateTaskProperties} from "../services/googleGeminiService";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    const parsed = await generateTaskProperties(prompt);
    res.json({ parsed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI parsing failed" });
  }
});

export default router;
