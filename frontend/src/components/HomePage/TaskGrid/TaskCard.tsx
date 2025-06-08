import React, { useState } from "react";
import { Task } from "../../../models/task.model";
import "./TaskCard.css";
import DeleteTaskButton from "./DeleteTaskButton";
import EditTaskButton from "./EditTaskButton";

type TaskCardProps = {
  task: Task;
  onTaskCreated: any;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskCreated }) => {
  const [showMenu, setShowMenu] = useState(false);
  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
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
        <span className={task.completed ? "completed" : "incomplete"}>
          {task.status === "todo"
            ? "ToDo"
            : task.status === "active"
            ? "Active"
            : "Completed"}
        </span>
      </p>
      <p className="task-points">🏆 Points: {task?.points?.toString()}</p>

      <p className="task-category">
        📁 Project: {task.category ? task.category.title : "None"}
      </p>

      <p className="task-date">📅 Created: {formattedDate}</p>
    </div>
  );
};

export default TaskCard;
