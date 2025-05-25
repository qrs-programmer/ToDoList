import React from "react";
import { Task } from "../../../models/task.model";
import TaskCard from "./TaskCard";
import CreateTaskButton from "./CreateTaskButton";

type TaskGridProps = {
  tasks: Task[];
  onTaskCreated: any;
};

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, onTaskCreated }) => {
  return (
    <div>
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
          <TaskCard
            key={task._id}
            task={task}
            onTaskCreated={onTaskCreated}
          ></TaskCard>
        ))}
      </div>
      <CreateTaskButton onTaskCreated={onTaskCreated}></CreateTaskButton>
    </div>
  );
};

export default TaskGrid;
