// utils/googleTokenManager.ts

import { google } from "googleapis";
import User from "../models/User";

export async function getAuthorizedOAuthClient(userId: string) {
  const user = await User.findOne({ auth0Id: userId });
  if (!user || !user.googleTokens) throw new Error("Google not connected");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: user.googleTokens.accessToken,
    refresh_token: user.googleTokens.refreshToken,
    expiry_date: user.googleTokens.expiryDate,
  });

  // If token is expired, refresh it
  if (Date.now() >= user.googleTokens.expiryDate!) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    user.googleTokens.accessToken = credentials.access_token;
    user.googleTokens.expiryDate = credentials.expiry_date!;
    await user.save();

    oauth2Client.setCredentials(credentials);
  }

  return oauth2Client;
}
