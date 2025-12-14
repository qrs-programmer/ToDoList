import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile: React.FC = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  const [showMenu, setShowMenu] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      ) : (
        <div>
          <span onClick={() => setShowMenu(!showMenu)}>
            <img
              src={user?.picture}
              alt="Profile"
              style={{ width: 35, borderRadius: "50%" }}
            />
          </span>
          {showMenu && (
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log Out
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
