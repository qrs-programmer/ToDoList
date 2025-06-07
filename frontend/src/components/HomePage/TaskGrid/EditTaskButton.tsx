import React, { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import { Task } from "../../../models/task.model";

type EditTaskButtonProps = {
  onTaskCreated: any;
  taskToEdit: Task;
};

const EditTaskButton: React.FC<EditTaskButtonProps> = ({
  onTaskCreated,
  taskToEdit,
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <button onClick={() => setShowModal(true)}>Edit</button>
      <CreateTaskModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onTaskCreated={onTaskCreated}
        operationType="update"
        taskToEdit={taskToEdit}
      ></CreateTaskModal>
    </div>
  );
};

export default EditTaskButton;
