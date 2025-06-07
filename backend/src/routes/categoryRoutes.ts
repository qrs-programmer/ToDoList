import express from "express";
import Task from "../models/Task"; 
import Category from "../models/Category";
const router = express.Router();

// GET all categories for a specific user
router.get("/", async (req: any, res: any) => {
  try {
    const userId = req.query.userId as string;
    const categories = await Category.find({ userId });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a category
router.post("/", async (req: any, res: any) => {
    try {
      const category = new Category(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Delete a category
    router.delete("/:id", async (req: any, res:any) => {
      try {
          const deletedCategory = await Category.findByIdAndDelete(req.params.id);
  
          if (!deletedCategory){
            return res.status(404).json({message:"Task not found!"});
          }
  
          res.status(200).json({message: "Task deleted successfully", category: deletedCategory});
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error deleting task"});
        }
    });

export default router;