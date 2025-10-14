import express from "express";
import { getAuthUrl, getTokens, getOAuthClient, oauth2Client } from "../services/googleAuth";
import User from "../models/User";
import { google } from "googleapis";
import { syncAllTasks } from "../services/googleCalendarService";

const router = express.Router();

router.get("/auth0Id", (req: any, res: any) => {
  const auth0Id = req.query.auth0Id as string; 

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
    state: auth0Id, 
  });

  res.redirect(authUrl);
});

router.get("/callback", async (req: any, res: any) => {
  const code = req.query.code as string;
  const auth0Id = req.query.state as string;

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Save tokens to user in DB
    await User.findOneAndUpdate(
      { auth0Id: auth0Id },
      {
        googleTokens: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiryDate: tokens.expiry_date,
        },
        googleSyncActive: true
      }
    );
    await syncAllTasks(auth0Id);
    res.redirect(`${process.env.CLIENT_URL}/home`);
  } catch (err) {
    console.error("Google Auth failed", err);
    res.status(500).send("Auth failed");
  }
});

export default router;
