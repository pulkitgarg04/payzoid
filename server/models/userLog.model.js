import mongoose from 'mongoose';

const userLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      action: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
});

export const userLog = mongoose.model('userLog', userLogSchema);