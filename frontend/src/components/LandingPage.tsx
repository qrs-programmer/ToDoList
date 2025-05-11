import React, { useEffect } from "react";
import "./LandingPage.css";
import Profile from "./Profile";
import { useAuth0 } from "@auth0/auth0-react";

const LandingPage: React.FC = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/home";
    }
  }, [isAuthenticated]);

  return (
    <div className="landing-page">
      <h1>Get Things Done</h1>
      <p>
        No more scattered lists or forgotten tasks. Keep everything in one place
        and take control of your day. Sign up and start planning.
      </p>
      <Profile></Profile>
    </div>
  );
};

export default LandingPage;
