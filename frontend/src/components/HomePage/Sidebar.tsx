import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { useCategories } from "../../context/CategoryContext";
import CreateProjectModal from "./CreateProjectModal";

const Sidebar: React.FC = () => {
  const { categories, setSelectedCategory } = useCategories();
  const [showModal, setShowModal] = useState(false);

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
