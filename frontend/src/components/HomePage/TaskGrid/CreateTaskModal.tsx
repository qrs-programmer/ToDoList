import React, { useEffect, useState } from "react";
import "./CreateTaskModal.css";
import { Task } from "../../../models/task.model";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

type CreateTaskModalProps = {
  show: boolean;
  onClose: () => void;
  onTaskCreated: any;
  operationType: "create" | "update";
  taskToEdit?: Task;
};

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  show,
  onClose,
  onTaskCreated,
  operationType,
  taskToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);

  const { user } = useAuth0();
  const userId = user?.sub!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      userId,
      title,
      description,
      points,
    };

    try {
      if (operationType === "create") {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/tasks`,
          newTask
        );
        console.log("Task created:", response.data);
      } else if (operationType === "update") {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/tasks/${taskToEdit?._id}`,
          newTask
        );
        console.log("Task updated:", response.data);
      }
      onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  useEffect(() => {
    if (show && operationType === "create") {
      setTitle("");
      setDescription("");
      setPoints(0);
    }

    if (show && operationType === "update" && taskToEdit) {
      setTitle(taskToEdit.title.valueOf());
      setDescription(taskToEdit.description.valueOf());
      setPoints(taskToEdit.points.valueOf());
    }
  }, [show, operationType, taskToEdit]);

  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Create Task</h2>

          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Task Points:</label>
          <input
            type="number"
            value={points}
            step="1"
            min="0"
            onChange={(e) => setPoints(parseFloat(e.target.value))}
          />
          <button type="submit">
            {taskToEdit ? "Save Changes" : "Create Task"}
          </button>
        </form>
        <button onClick={onClose} style={{ marginTop: "1rem" }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateTaskModal;
