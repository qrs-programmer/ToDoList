import express from "express";
import Task from "../models/Task"; 

const router = express.Router();

// GET all tasks for a specific user
router.get("/", async (req: any, res: any) => {
  try {
    const userId = req.query.userId as string;
    const tasks = await Task.find({ userId }).populate("category").populate("subtasks");
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

  // Delete a task
  router.delete("/:id", async (req: any, res:any) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask){
          return res.status(404).json({message:"Task not found!"});
        }

        res.status(200).json({message: "Task deleted successfully", task: deletedTask});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting task"});
      }
  });

  //Edit a task
router.put("/:id", async (req: any, res: any) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
      if (!updatedTask) {
        return res.status(404).json({message:"Task not found!"});
      }
      
      res.status(200).json({message: "Task updated successfully", task: updatedTask});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  export default router;