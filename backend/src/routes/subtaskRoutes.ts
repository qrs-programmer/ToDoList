import express from "express";
import Subtask from "../models/Subtask"; 
import Task from "../models/Task";
const router = express.Router();

// GET all subtasks for a specific user
router.get("/", async (req: any, res: any) => {
   try {
    const userId = req.query.userId as string;
    const parentTaskId = req.query.parentTask as string;

    const filter: any = { userId };
    if (parentTaskId) {
      filter.parentTask = parentTaskId;
    }

    const subtasks = await Subtask.find(filter)
      .populate("parentTask")
      .populate("category");

    res.json(subtasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a subtask
router.post("/", async (req: any, res: any) => {
    try {
      const parentTask = req.body.parentTask;  
      const subtask = new Subtask(req.body);
      await subtask.save();
      await Task.findByIdAndUpdate(
      parentTask,
      { $push: { subtasks: subtask._id } },
      { new: true }
    );
      res.status(201).json(subtask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Delete a subtask
  router.delete("/:id", async (req: any, res:any) => {
    try {
        const deletedSubtask = await Subtask.findByIdAndDelete(req.params.id);

        if (!deletedSubtask){
          return res.status(404).json({message:"Subtask not found!"});
        }

        res.status(200).json({message: "Subtask deleted successfully", subtask: deletedSubtask});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting subtask"});
      }
  });

  //Edit a subtask
router.put("/:id", async (req: any, res: any) => {
    try {
      const updatedSubtask = await Subtask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
      if (!updatedSubtask) {
        return res.status(404).json({message:"Subtask not found!"});
      }
      
      res.status(200).json({message: "Subtask updated successfully", subtask: updatedSubtask});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  export default router;