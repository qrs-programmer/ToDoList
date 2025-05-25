export interface Task {
  userId: String;
  title: String;
  description: String;
  points: Number;
  completed?: Boolean;
  createdAt?: Date;
}
