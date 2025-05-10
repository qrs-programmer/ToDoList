import express from "express";
import Task from "../models/Task"; 
const router = express.Router();

// GET all tasks for a specific user
router.get("/", async (req: any, res: any) => {
  try {
    const userId = req.query.userId as string;
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a task
router.post("/", async (req: any, res: any) => {
    try {
      const task = new Task(req.body);
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  export default router;