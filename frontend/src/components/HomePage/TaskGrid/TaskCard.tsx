import React from "react";
import { Task } from "../../../models/task.model";
import "./TaskCard.css";
import DeleteTaskButton from "./DeleteTaskButton";
import EditTaskButton from "./EditTaskButton";

type TaskCardProps = {
  task: Task;
  onTaskCreated: any;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskCreated }) => {
  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="task-card">
      <h3 className="task-title">{task.title}</h3>
      <p>{task.description}</p>
      <p>Task Points: {task?.points?.toString()}</p>
      {task.category && <p>Project: {task.category.title}</p>}
      <p className="task-status">
        Status:{" "}
        <span className={task.completed ? "completed" : "incomplete"}>
          {task.completed ? "Completed" : "Incomplete"}
        </span>
      </p>
      <p className="task-date">Created on: {formattedDate}</p>
      <DeleteTaskButton
        task={task}
        onTaskCreated={onTaskCreated}
      ></DeleteTaskButton>
      <EditTaskButton
        taskToEdit={task}
        onTaskCreated={onTaskCreated}
      ></EditTaskButton>
    </div>
  );
};

export default TaskCard;
