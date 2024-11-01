import mongoose from 'mongoose';

const userLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
  },
  os: {
    type: String,
  },
  browser: {
    type: String,
  },
  device: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
});

export const userLog = mongoose.model('userLog', userLogSchema);