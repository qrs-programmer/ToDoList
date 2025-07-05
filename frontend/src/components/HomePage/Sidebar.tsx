import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { useCategories } from "../../context/CategoryContext";
import CreateProjectModal from "./CreateProjectModal";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const Sidebar: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const { categories, setSelectedCategory } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [showMenuIndex, setShowMenuIndex] = useState(-1);
  const [userSyncStatus, setUserSyncStatus] = useState(false);

  const { refreshCategories } = useCategories();

  const syncGoogleCalendar = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/google/sync`,
        { userId: user?.sub }
      );
      console.log(response);
      if (response.data.redirectToConsent) {
        // Redirect to OAuth consent flow
        window.location.href = `http://localhost:5000/auth/google/auth0Id?auth0Id=${user?.sub}`;
      } else {
        // Show success message / update UI
        console.log("Tasks synced to Google Calendar!");
      }
    } catch (err) {
      console.error("Error syncing:", err);
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
  const handleDeleteCategory = async (id: any) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/categories/${id}`
      );
      refreshCategories();
      setShowMenuIndex(-1);
      setSelectedCategory(null);
      console.log("Project deleted:", response.data);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    getUserSyncStatus();
    const handleClickOutside = () => setShowMenuIndex(-1);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <aside className="sidebar">
      <ul className="category-list">
        <li onClick={() => setSelectedCategory(null)} className="category-item">
          All
        </li>
      </ul>
      <div>
        <div className="sidebar-title-row">
          <p className="sidebar-title">Projects</p>
          <button
            className="add-project-button"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>
        <CreateProjectModal
          show={showModal}
          onClose={() => setShowModal(false)}
        ></CreateProjectModal>
      </div>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li
            key={index}
            className="category-item"
            onClick={() => setSelectedCategory(category)}
          >
            {category.title}

            <div className="dots-container" style={{ position: "relative" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenuIndex(index === showMenuIndex ? -1 : index);
                }}
                className="dots-button-horizontal"
              >
                &hellip;
              </button>

              {showMenuIndex === index && (
                <div className="mini-modal">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category._id);
                      setShowMenuIndex(-1);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button
        className="google-sync-button"
        onClick={(e) => {
          syncGoogleCalendar();
        }}
      >
        {!userSyncStatus && (
          <img
            src="/assets/google-calendar-icon.png"
            alt="Google Calendar"
            className="google-calendar-logo"
          />
        )}
        {userSyncStatus && (
          <img
            src="/assets/check.png"
            alt="Sync Status"
            className="google-calendar-logo"
          />
        )}
        {userSyncStatus ? "Calendar Synced" : "Connect Google Calendar"}
      </button>
    </aside>
  );
};

export default Sidebar;
