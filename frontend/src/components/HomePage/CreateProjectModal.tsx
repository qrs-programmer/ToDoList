import React, { useEffect, useState } from "react";
import "./TaskGrid/CreateTaskModal.css";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useCategories } from "../../context/CategoryContext";
import { Category } from "../../models/category.model";

type CreateTaskModalProps = {
  show: boolean;
  onClose: () => void;
};

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ show, onClose }) => {
  const { refreshCategories } = useCategories();
  const [title, setTitle] = useState("");

  const { user } = useAuth0();
  const userId = user?.sub!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCategory: Category = {
      userId,
      title,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/categories`,
        newCategory
      );
      console.log("Project created:", response.data);
      refreshCategories();
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  useEffect(() => {
    if (show) {
      setTitle("");
    }
  }, [show]);

  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Create Project</h2>

          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit">Create Project</button>
        </form>
        <button onClick={onClose} style={{ marginTop: "1rem" }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateTaskModal;
