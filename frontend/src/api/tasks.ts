import axios from "axios";
import { Task } from "../models/task.model";

export async function updateTask(id: string, updatedTask: Task) {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/tasks/${id}`,
      updatedTask
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}
