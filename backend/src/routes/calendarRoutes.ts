import express from 'express';
import { oauth2Client } from '../services/googleAuth';
import { getAuthorizedOAuthClient } from "../services/googleTokenManager";
import { google } from 'googleapis';

const router = express.Router();


router.post("/create-event", async (req, res) => {
  try {
    const { userId, summary, startTime, endTime } = req.body;

    const auth = await getAuthorizedOAuthClient(userId);
    if (auth) {
        console.log("yay auth");
    }
    else console.log("nay auth");
    const calendar = google.calendar({ version: "v3", auth });
    if (calendar) {
        console.log("yay calendar");
    }
    else console.log("nay calendar");
    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary,
        start: { dateTime: startTime },
        end: { dateTime: endTime },
      },
    });

    res.status(200).json({ event: event.data });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Failed to create event");
  }
});

export default router;
