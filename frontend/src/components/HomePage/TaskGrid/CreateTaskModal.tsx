import React, { useEffect, useState } from "react";
import "./CreateTaskModal.css";
import { Task } from "../../../models/task.model";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useCategories } from "../../../context/CategoryContext";
import { updateTask } from "../../../api/tasks";
import { Subtask } from "../../../models/subtask.model";

type CreateTaskModalProps = {
  show: boolean;
  onClose: () => void;
  onTaskCreated: any;
  taskType: "task" | "subtask";
  task?: Task;
};

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  show,
  onClose,
  onTaskCreated,
  taskType,
  task,
}) => {
  const { categories } = useCategories();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState("todo");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const { user } = useAuth0();
  const userId = user?.sub!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const category = categories.find((cat) => cat._id === selectedCategoryId);
    console.log(category);

    try {
      if (taskType === "task") {
        const newTask: Task = {
          userId,
          title,
          description,
          points,
          category,
          status,
          subtasks: [],
        };
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/tasks`,
          newTask
        );
        console.log("Task created:", response.data);
      } else if (taskType === "subtask") {
        console.log("CREATING SUBTASK");
        const newSubtask: Subtask = {
          userId,
          parentTask: task!,
          title,
          description,
          points,
          category,
          status,
        };
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/subtasks`,
          newSubtask
        );
        console.log("Subtask created:", response.data);
      }
      onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  useEffect(() => {
    if (show) {
      setTitle("");
      setDescription("");
      setPoints(0);
    }
  }, [show]);

  if (!show) return null;
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
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
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todo">To Do</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <label>Task Points:</label>
          <input
            type="number"
            value={points}
            step="1"
            min="0"
            onChange={(e) => setPoints(parseFloat(e.target.value))}
          />
          <label>Project:</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
          <button type="submit">
            {task ? "Create Subtask" : "Create Task"}
          </button>
        </form>
        <button onClick={onClose} style={{ marginTop: "1rem", color: "blue" }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateTaskModal;
