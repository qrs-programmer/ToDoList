import React, { useState } from "react";
import { Task } from "../../../models/task.model";
import "./TaskCard.css";
import DeleteTaskButton from "./DeleteTaskButton";
import EditTaskButton from "./EditTaskButton";
import { updateTask } from "../../../api/tasks";
import TaskCardDetailsModal from "./TaskCardDetailsModal";

type TaskCardProps = {
  task: Task;
  onTaskCreated: any;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskCreated }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [status, setStatus] = useState(task.status.toString());
  const [showModal, setShowModal] = useState(false);

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString()
    : "N/A";

  async function handleStatusUpdate(status: string): Promise<void> {
    const newTask: Task = {
      ...task,
      userId: task.userId,
      title: task.title,
      description: task.description,
      points: task.points,
      category: task.category,
      status,
    };

    try {
      const updated = await updateTask(task._id, newTask);
      console.log("Task updated:", updated);
      onTaskCreated();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 onClick={() => setShowModal(true)} className="task-title">
          {task.title}
        </h3>
        <TaskCardDetailsModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onTaskCreated={onTaskCreated}
          task={task}
        />
        <div className="options-menu-wrapper">
          <button
            className="dots-button-vertical"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            &#x22EE;
          </button>
          {showMenu && (
            <>
              <div
                className="options-menu-overlay"
                onClick={() => setShowMenu(!showMenu)}
              />
              <div className="options-menu">
                <DeleteTaskButton
                  task={task}
                  onTaskCreated={onTaskCreated}
                ></DeleteTaskButton>
                <EditTaskButton
                  taskToEdit={task}
                  onTaskCreated={onTaskCreated}
                ></EditTaskButton>
              </div>
            </>
          )}
        </div>
      </div>
      <p className="task-status">
        <span
          className={
            task.status === "todo"
              ? "dot-todo"
              : task.status === "active"
              ? "dot-active"
              : "dot-completed"
          }
        ></span>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            handleStatusUpdate(e.target.value);
          }}
          className="task-status-select"
        >
          <option value="todo">Todo</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </p>
      <p className="task-points">🏆 Points: {task?.points?.toString()}</p>

      <p className="task-category">
        📁 Project: {task.category ? task.category.title : "None"}
      </p>
      <p className="task-category">
        📋{" "}
        {task.subtasks?.filter((x) => x.completed).length +
          "/" +
          task.subtasks?.length}
      </p>

      <p className="task-date">📅 Created: {formattedDate}</p>
    </div>
  );
};

export default TaskCard;
