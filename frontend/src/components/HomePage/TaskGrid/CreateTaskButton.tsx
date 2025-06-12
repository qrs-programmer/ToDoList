import React, { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import "./CreateTaskButton.css";
import { Task } from "../../../models/task.model";

type CreateTaskButtonProps = {
  taskType: "task" | "subtask";
  onTaskCreated: any;
  task?: Task;
};

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({
  taskType,
  onTaskCreated,
  task,
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="add-task-button"
        onClick={() => setShowModal(true)}
      >
        <span className="plus-icon">+</span>{" "}
        {taskType === "task" ? "New task" : "New subtask"}
      </button>
      <CreateTaskModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onTaskCreated={onTaskCreated}
        taskType={taskType}
        task={task ? task : undefined}
      />
    </div>
  );
};

export default CreateTaskButton;
