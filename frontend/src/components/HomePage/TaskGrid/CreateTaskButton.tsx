import React, { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import "./CreateTaskButton.css";

type CreateTaskButtonProps = {
  onTaskCreated: any;
};

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({
  onTaskCreated,
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <button className="add-task-button" onClick={() => setShowModal(true)}>
        <span className="plus-icon">+</span> New task
      </button>
      <CreateTaskModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onTaskCreated={onTaskCreated}
        operationType="create"
      />
    </div>
  );
};

export default CreateTaskButton;
