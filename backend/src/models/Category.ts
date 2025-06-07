import mongoose, { Schema } from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: String,
  title: String,
});

export default mongoose.model('Category', categorySchema);