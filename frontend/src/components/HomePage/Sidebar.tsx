import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { useCategories } from "../../context/CategoryContext";
import Profile from "../Profile";
import CreateProjectModal from "./CreateProjectModal";

const Sidebar: React.FC = () => {
  const { categories, setSelectedCategory } = useCategories();
  const [showModal, setShowModal] = useState(false);

  return (
    <aside className="sidebar">
      <Profile></Profile>
      <h3 className="sidebar-title">Projects</h3>
      <button onClick={() => setShowModal(true)}>Add Project</button>
      <CreateProjectModal
        show={showModal}
        onClose={() => setShowModal(false)}
      ></CreateProjectModal>
      <ul className="category-list">
        <li onClick={() => setSelectedCategory(null)} className="category-item">
          All
        </li>
        {categories.map((category, index) => (
          <li
            onClick={() => setSelectedCategory(category)}
            key={index}
            className="category-item"
          >
            {category.title}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
