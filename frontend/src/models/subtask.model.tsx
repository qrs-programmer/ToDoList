import { Category } from "./category.model";
import { Task } from "./task.model";

export interface Subtask {
  userId: String;
  parentTask: Task;
  title: String;
  description: String;
  points: Number;
  category?: Category;
  completed?: Boolean;
  status: String;
  createdAt?: Date;
  _id?: any;
  timeBlock: {
    start: Date;
    end: Date;
    durationMinutes: number;
  };
}
