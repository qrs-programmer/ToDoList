import React, { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import { Task } from "../../../models/task.model";
import TaskCardDetailsModal from "./TaskCardDetailsModal";

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
      <TaskCardDetailsModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onTaskCreated={onTaskCreated}
        task={taskToEdit}
      />
    </div>
  );
};

export default EditTaskButton;
