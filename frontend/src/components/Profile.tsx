// src/components/Profile.tsx (or any filename you prefer)

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile: React.FC = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  if (isLoading) return <p>Loading...</p>;
  console.log(isAuthenticated);
  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      ) : (
        <div>
          <p>Welcome, {user?.name}</p>
          <img
            src={user?.picture}
            alt="Profile"
            style={{ width: 50, borderRadius: "50%" }}
          />
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
