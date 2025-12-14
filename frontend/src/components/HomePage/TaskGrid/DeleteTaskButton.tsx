import axios from "axios";
import React, { useState } from "react";
import { Task } from "../../../models/task.model";
import "./DeleteTaskButton.css";

type DeleteTaskButtonProps = {
  task: Task;
  onTaskCreated: any;
};

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({
  task,
  onTaskCreated,
}) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/tasks/${task._id}`
      );
      onTaskCreated();
      console.log("Task deleted:", response.data);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  return (
    <div>
      <button className="options-menu-button" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};

export default DeleteTaskButton;
