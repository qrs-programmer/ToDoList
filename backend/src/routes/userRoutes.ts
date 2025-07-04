import express from "express";
import User from "../models/User";

const router = express.Router();

// GET all users
router.get("/", async (req: any, res: any) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a user
router.post("/", async (req: any, res: any) => {
  try {
    const { auth0Id, email } = req.body;

    // Check if user already exists
    let user = await User.findOne({ auth0Id });

    if (user) {
      return res.status(200).json(user);
    }

    // Create new user
    user = new User({ auth0Id, email });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error("User creation failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;