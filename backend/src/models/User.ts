import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  googleTokens: {
    accessToken: String,
    refreshToken: String,
    expiryDate: Number,
  },
});

export default mongoose.model('User', userSchema);