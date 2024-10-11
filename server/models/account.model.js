import mongoose from 'mongoose';

const AccountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    min: 0,
  },
});

export const Account = mongoose.model('Account', AccountSchema);