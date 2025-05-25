import React from "react";
import { Task } from "../../../models/task.model";
import "./TaskCard.css";

type TaskCardProps = {
  task: Task;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="task-card">
      <h3 className="task-title">{task.title}</h3>
      <p>{task.description}</p>
      <p>Task Points: {task?.points?.toString()}</p>
      <p className="task-status">
        Status:{" "}
        <span className={task.completed ? "completed" : "incomplete"}>
          {task.completed ? "Completed" : "Incomplete"}
        </span>
      </p>
      <p className="task-date">Created on: {formattedDate}</p>
    </div>
  );
};

export default TaskCard;
