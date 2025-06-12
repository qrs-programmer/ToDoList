import React, { useEffect, useState } from "react";
import "./TaskCardDetailsModal.css";
import { Task } from "../../../models/task.model";
import { useAuth0 } from "@auth0/auth0-react";
import { useCategories } from "../../../context/CategoryContext";
import { updateTask } from "../../../api/tasks";
import CreateTaskButton from "./CreateTaskButton";
import SubtaskCard from "./SubtaskCard";

type TaskCardDetailsModalProps = {
  show: boolean;
  onClose: () => void;
  onTaskCreated: any;
  task: Task;
};

const TaskCardDetailsModal: React.FC<TaskCardDetailsModalProps> = ({
  show,
  onClose,
  onTaskCreated,
  task,
}) => {
  const { categories } = useCategories();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState(task.status.toString());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const subtasks = task.subtasks;
  const { user } = useAuth0();
  const userId = user?.sub!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const category = categories.find((cat) => cat._id === selectedCategoryId);
    console.log(category);

    const newTask: Task = {
      userId,
      title,
      description,
      points,
      category,
      status,
    };

    try {
      const updated = await updateTask(task._id, newTask);
      console.log("Task updated:", updated);

      onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title.valueOf());
      setDescription(task.description.valueOf());
      setPoints(task.points.valueOf());
    }
  }, [show, task]);

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
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.title}</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-content">
            <div className="form-section">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-section">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div className="form-grid">
              <div className="form-section">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-section">
                <label>Points</label>
                <input
                  type="number"
                  value={points}
                  step="1"
                  min="0"
                  onChange={(e) => setPoints(parseFloat(e.target.value))}
                />
              </div>
              <div className="form-section">
                <label>Project</label>
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
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="primary-button">
                Save Changes
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
          <div className="subtask-section">
            <p className="subtask-heading">Subtasks</p>

            <div className="subtask-grid">
              {subtasks?.map((subtask) => (
                <SubtaskCard
                  key={subtask._id}
                  subtask={subtask}
                  onTaskCreated={onTaskCreated}
                />
              ))}
            </div>

            <CreateTaskButton
              taskType={"subtask"}
              onTaskCreated={onTaskCreated}
              task={task}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCardDetailsModal;
