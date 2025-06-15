import React, { useEffect, useState } from "react";
import "./TaskCardDetailsModal.css";
import { Task } from "../../../models/task.model";
import { useAuth0 } from "@auth0/auth0-react";
import { useCategories } from "../../../context/CategoryContext";
import { updateTask } from "../../../api/tasks";
import CreateTaskButton from "./CreateTaskButton";
import SubtaskCard from "./SubtaskCard";
import { Subtask } from "../../../models/subtask.model";
import axios from "axios";

type TaskCardDetailsModalProps = {
  show: boolean;
  onClose: () => void;
  onTaskCreated: any;
  task: Task | Subtask;
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
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    task.category?._id || ""
  );
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  function isTask(task: Task | Subtask): task is Task {
    return "subtasks" in task;
  }

  //const subtasks = isTask(task) ? task.subtasks : null;
  const { user } = useAuth0();
  const userId = user?.sub!;

  const handleSubtaskCreated = () => {
    setFetchTrigger((prev) => !prev);
    onTaskCreated();
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/subtasks?userId=${userId}&parentTask=${task._id}`
      );
      console.log(res.data);
      setSubtasks(res.data);
    } catch (error) {
      console.log("Error fetching subtasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const category = categories.find((cat) => cat._id === selectedCategoryId);
    console.log(category);
    if (isTask(task)) {
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
    } else {
      const parentTask = task.parentTask;
      const newTask: Subtask = {
        userId,
        parentTask,
        title,
        description,
        points,
        category,
        status,
      };
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/subtasks/${task._id}`,
          newTask
        );
        onTaskCreated();
        onClose();
        return response.data;
      } catch (error) {
        console.error("Error updating task:", error);
        throw error;
      }
    }
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title.valueOf());
      setDescription(task.description.valueOf());
      setPoints(task.points.valueOf());
      setSelectedCategoryId(task.category?._id);
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
          {isTask(task) && (
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
                onTaskCreated={handleSubtaskCreated}
                task={task}
              />
            </div>
          )}
          {!isTask(task) && (
            <div className="subtask-section">
              <p className="subtask-heading">Parent Task</p>

              <div className="subtask-grid">
                <p>{task.parentTask.title}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCardDetailsModal;
