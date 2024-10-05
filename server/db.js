import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30, 
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxLength: 50,
  },
});

UserSchema.methods.createHash = async function (password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function (incomingPassword) {
  return await bcrypt.compare(incomingPassword, this.password);
};

export const Account = mongoose.model('Account', AccountSchema);
export const User = mongoose.model('User', UserSchema);