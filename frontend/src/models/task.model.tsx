import { Category } from "./category.model";

export interface Task {
  userId: String;
  title: String;
  description: String;
  points: Number;
  category?: Category;
  completed?: Boolean;
  status: String;
  createdAt?: Date;
  _id?: any;
}
