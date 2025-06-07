import mongoose, { Schema } from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  points: Number,
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);