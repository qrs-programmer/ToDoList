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
    ? tasks.filter((task) => task.category?._id === selectedCategory._id)
    : tasks;
  const todoTasks = visibleTasks
    ? visibleTasks.filter(
        (task) => task.status === "todo" && task.deleted === false
      )
    : null;
  const activeTasks = visibleTasks
    ? visibleTasks.filter(
        (task) => task.status === "active" && task.deleted === false
      )
    : null;
  const completedTasks = visibleTasks
    ? visibleTasks.filter(
        (task) => task.status === "completed" && task.deleted === false
      )
    : null;

  return (
    <div className="task-grid-container">
      <div className="task-grid">
        <div className="task-column">
          <p className="column-title">TODO</p>
          {todoTasks?.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onTaskCreated={onTaskCreated}
            />
          ))}
        </div>
        <div className="task-column">
          <p className="column-title">Active</p>
          {activeTasks?.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onTaskCreated={onTaskCreated}
            />
          ))}
        </div>
        <div className="task-column">
          <p className="column-title">Completed</p>
          {completedTasks?.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onTaskCreated={onTaskCreated}
            />
          ))}
        </div>
      </div>

      <div>
        <CreateTaskButton taskType={"task"} onTaskCreated={onTaskCreated} />
      </div>
    </div>
  );
};

export default TaskGrid;
