import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  points: Number,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);