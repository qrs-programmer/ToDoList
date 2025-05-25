import React from "react";
import { Task } from "../models/task.model";
import TaskCard from "./TaskCard";

type TaskGridProps = {
  tasks: Task[];
};

const TaskGrid: React.FC<TaskGridProps> = ({ tasks }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "flex-start",
        padding: "1rem",
      }}
    >
      {tasks.map((task) => (
        <TaskCard task={task}></TaskCard>
      ))}
    </div>
  );
};

export default TaskGrid;
