import { User } from '../models/user.model.js';
import { Account } from '../models/account.model.js';
import { userLog } from '../models/userLog.model.js';
import {
  signUpSchema,
  signinSchema,
  updateUserSchema,
} from '../utils/zodSchemas.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
  
    const { success } = signUpSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: 'Invalid Inputs' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already taken' });
    }
  
    const user = new User({
      email,
      firstName,
      lastName,
    });
    
    const hashedPassword = await user.createHash(password);
    user.password = hashedPassword;
    await user.save();
    
    const userId = user._id;
    const account = await Account.create({
      userId,
      balance: Math.floor(Math.random() * 90000) + 10000,
    });
    
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    const userResponse = user.toObject();
    
    userResponse.balance = account.balance;

    await userLog.create({
      userId,
      action: 'signup',
    });

    res.status(200).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userResponse,
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { success } = signinSchema.safeParse({ email, password });
  
    if (!success) {
      return res.status(400).json({ message: 'Invalid Inputs' });
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const userId = user._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    const account = await Account.findOne({ userId });
    const userResponse = user.toObject();
    delete userResponse.password;

    userResponse.balance = account.balance;

    await userLog.create({
      userId,
      action: 'login',
    });

    return res.status(200).json({
      success: true,
      message: 'Login Successful',
      token,
      user: userResponse
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' }); 
  }
};

export const getUser = async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { userId } = jwt.decode(req.token);

    const user = await User.findOne({ _id: userId });
    const account = await Account.findOne({ userId: req.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const userResponse = user.toObject();
    userResponse.balance = account.balance;

    console.log(userResponse);

    res.status(200).json({ user: userResponse });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
}

export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const { success } = updateUserSchema.safeParse({
      firstName,
      lastName,
      password,
    });
    if (!success) {
      return res.status(411).json({ message: 'Invalid Inputs' });
    }
    const updateFields = { firstName, lastName };
    if (password) {
      const user = await User.findOne({ _id: req.userId });
      const hashedPassword = await user.createHash(password);
      updateFields.password = hashedPassword;
    }
    await User.findOneAndUpdate({ _id: req.userId }, updateFields);
    res.status(200).json({ message: 'User updated Successfully' });
  } catch (error) {
    return res.status(401).json({ message: 'Server Error' });
  }
};

export const filterUsers = async (req, res) => {
  try {
    const filter = req.query.filter || '';
    const regexFilter = new RegExp(filter, 'i');
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: regexFilter,
          },
        },
        {
          lastName: {
            $regex: regexFilter,
          },
        },
      ],
    });

    res.json({
      user: users.map((user) => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    return res.status(401).json({ message: 'Server Error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.userId });
    await Account.findOneAndDelete({ userId: req.userId });
    res.status(200).json({ message: 'User deleted Successfully' });
  } catch (error) {
    return res.status(401).json({ message: 'Server Error' });
  }
};
