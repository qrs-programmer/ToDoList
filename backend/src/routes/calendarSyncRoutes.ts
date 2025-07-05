import express from "express";
import Task from "../models/Task"; 
import { getAuthorizedOAuthClient } from "../services/googleTokenManager";
import { google } from 'googleapis';
import User from "../models/User";
import { syncAllTasks } from "../services/googleCalendarService";
const router = express.Router();

router.post("/", async (req: any, res: any) => {
  const { userId } = req.body;
  console.log(req.body);
  console.log(userId);
  try {
    // See if user is connected to Google Calendar
    const user = await User.findOne({ auth0Id: userId });
    if (!user) return res.status(404).send("User not found");

    if (!user.googleTokens || !user.googleTokens.accessToken) {
      return res.status(200).json({ redirectToConsent: true });
    }

    // If user is connected, sync tasks
    await syncAllTasks(userId);

    res.status(200).json({ message: "Tasks synced with Google Calendar" });
  } catch (err) {
    console.error("Error syncing tasks:", err);
    res.status(500).json({ message: "Sync failed" });
  }
});

export default router;