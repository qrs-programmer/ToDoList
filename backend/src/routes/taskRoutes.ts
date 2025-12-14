import express from "express";
import Task from "../models/Task"; 
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent, updateGoogleCalendarEvent } from "../services/googleCalendarService";
import User from "../models/User";

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
      
      const user = await User.findOne({ auth0Id: task.userId })

      if (user?.googleSyncActive) {
        const res = await createGoogleCalendarEvent(task, task.userId);
        console.log(res);
        task.googleEventId = res;
      }
      
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
        const deletedTask = await Task.findById(req.params.id);

        if (!deletedTask){
          return res.status(404).json({message:"Task not found!"});
        }

        deletedTask.deleted = true;
        await deletedTask.save();

        const user = await User.findOne({ auth0Id: deletedTask.userId })

        if (user?.googleSyncActive && deletedTask.googleEventId) {
          await deleteGoogleCalendarEvent(deletedTask.googleEventId, deletedTask.userId);
          await Task.findByIdAndDelete(req.params.id);
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

      const user = await User.findOne({ auth0Id: updatedTask.userId })

      if (user?.googleSyncActive && updatedTask.googleEventId) {
        await updateGoogleCalendarEvent(updatedTask, updatedTask.userId);
      }

      
      res.status(200).json({message: "Task updated successfully", task: updatedTask});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  export default router;