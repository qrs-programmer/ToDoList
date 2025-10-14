import React, { useContext, useEffect, useState } from "react";
import "./GoogleCalendar.css";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const GoogleCalendar: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();

  const [userSyncStatus, setUserSyncStatus] = useState(false);

  const syncGoogleCalendar = async (syncToggle: any) => {
    if (syncToggle.checked) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/google/sync`,
          { userId: user?.sub }
        );
        console.log(response);
        if (response.data.redirectToConsent) {
          // Redirect to OAuth consent flow
          window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/auth0Id?auth0Id=${user?.sub}`;
        } else {
          console.log("Tasks synced to Google Calendar!");
        }
        setUserSyncStatus(true);
      } catch (err) {
        console.error("Error syncing:", err);
      }
    } else {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/sync-toggle`,
          { auth0Id: user?.sub, googleSyncActive: false }
        );
        setUserSyncStatus(false);
      } catch (err) {
        console.error("Error syncing:", err);
      }
    }
  };

  const getUserSyncStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/getUser?auth0Id=${user?.sub}`
      );
      setUserSyncStatus(response.data.googleSyncActive);
      console.log("Sync Status:", response.data.googleSyncActive);
    } catch (error) {
      console.error("Error getting sync status:", error);
    }
  };

  useEffect(() => {
    getUserSyncStatus();
  }, []);

  return (
    <div>
      <div className="google-sync-toggle">
        <img
          src="/assets/google-calendar-icon.png"
          alt="Google Calendar"
          className={`google-calendar-logo ${userSyncStatus ? "synced" : ""}`}
          title={
            userSyncStatus ? "Calendar Synced" : "Sync with Google Calendar"
          }
        />
        <label className="switch">
          <input
            type="checkbox"
            checked={userSyncStatus}
            onChange={(e) => syncGoogleCalendar(e.currentTarget)}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default GoogleCalendar;
