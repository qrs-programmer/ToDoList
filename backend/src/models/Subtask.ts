import mongoose, { Schema } from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  userId: String,
  parentTask: { type: Schema.Types.ObjectId, ref: "Task" },
  title: String,
  description: String,
  points: Number,
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  completed: { type: Boolean, default: false },
  status: {type: String, default: "todo"},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Subtask || mongoose.model("Subtask", subtaskSchema);