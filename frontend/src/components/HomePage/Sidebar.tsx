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

  const { refreshCategories } = useCategories();

  const syncGoogleCalendar = async () => {
    window.location.href = `http://localhost:5000/auth/google/auth0Id?auth0Id=${user?.sub}`;
  };

  const createEventTest = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/google/events/create-event`,
        {
          userId: user?.sub,
          summary: "Test Event from Frontend",
          startTime: "2025-07-05T10:00:00-04:00",
          endTime: "2025-07-05T11:00:00-04:00",
        }
      );
      console.log("Event created:", response.data);
    } catch (error) {
      console.error("Error creating event:", error);
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
        onClick={(e) => {
          syncGoogleCalendar();
        }}
      >
        Sync Calendar
      </button>
      <button
        onClick={(e) => {
          createEventTest();
        }}
      >
        Create Test Event
      </button>
    </aside>
  );
};

export default Sidebar;
