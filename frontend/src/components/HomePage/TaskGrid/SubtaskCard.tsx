import React, { useState } from "react";
import { Task } from "../../../models/task.model";
import "./TaskCard.css";
import DeleteTaskButton from "./DeleteTaskButton";
import EditTaskButton from "./EditTaskButton";
import { updateTask } from "../../../api/tasks";
import TaskCardDetailsModal from "./TaskCardDetailsModal";
import { Subtask } from "../../../models/subtask.model";

type TaskCardProps = {
  subtask: Subtask;
  onTaskCreated: any;
};

const TaskCard: React.FC<TaskCardProps> = ({ subtask, onTaskCreated }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const formattedDate = subtask.createdAt
    ? new Date(subtask.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 onClick={() => setShowModal(true)} className="task-title">
          {"📋 " + subtask.title}
        </h3>
        <TaskCardDetailsModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onTaskCreated={onTaskCreated}
          task={subtask}
        />
      </div>
      <p className="task-date">📅 Created: {formattedDate}</p>
    </div>
  );
};

export default TaskCard;
