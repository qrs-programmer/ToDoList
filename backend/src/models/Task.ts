import mongoose, { Document, Schema } from 'mongoose';

export interface TaskDocument extends Document {
  userId: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  status: string;
  createdAt: Date;
  googleEventId?: string;
  syncedWithGoogle: boolean;
  deleted?: boolean;
}

const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  points: Number,
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  completed: { type: Boolean, default: false },
  status: {type: String, default: "todo"},
  createdAt: { type: Date, default: Date.now },
  subtasks: [{ type: Schema.Types.ObjectId, ref: "Subtask", default: [] }],
  googleEventId: { type: String, default: null },
  syncedWithGoogle: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
});

export default mongoose.models.Task || mongoose.model("Task", taskSchema);