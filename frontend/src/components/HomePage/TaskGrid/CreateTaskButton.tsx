import React, { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";

type CreateTaskButtonProps = {
  onTaskCreated: any;
};

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({
  onTaskCreated,
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <button onClick={() => setShowModal(true)}>Add Task</button>
      <CreateTaskModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onTaskCreated={onTaskCreated}
      ></CreateTaskModal>
    </div>
  );
};

export default CreateTaskButton;
