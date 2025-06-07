import React from "react";
import { Task } from "../../../models/task.model";
import TaskCard from "./TaskCard";
import CreateTaskButton from "./CreateTaskButton";
import "./TaskGrid.css";
import { useCategories } from "../../../context/CategoryContext";

type TaskGridProps = {
  tasks: Task[];
  onTaskCreated: any;
};

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, onTaskCreated }) => {
  const { selectedCategory } = useCategories();

  const visibleTasks = selectedCategory
    ? tasks.filter((task) => task.category === selectedCategory._id)
    : tasks;
  return (
    <div className="task-grid-container">
      <h1>{selectedCategory?.title}</h1>
      <div className="task-grid">
        {visibleTasks.map((task) => (
          <TaskCard key={task._id} task={task} onTaskCreated={onTaskCreated} />
        ))}
      </div>
      <CreateTaskButton onTaskCreated={onTaskCreated} />
    </div>
  );
};

export default TaskGrid;
