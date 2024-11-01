import { User } from '../models/user.model.js';
import { Account } from '../models/account.model.js';
import { userLog } from '../models/userLog.model.js';
import { Notification } from '../models/notifications.model.js';
import {
  signUpSchema,
  signinSchema,
  updateUserSchema,
} from '../utils/zodSchemas.js';
import jwt from 'jsonwebtoken';
import { otpTemplate } from '../utils/mailTemplates/otpVerification.template.js';
import { mailsender } from '../utils/mailSender.js';
import DeviceDetector from 'node-device-detector';
import cloudinary from '../utils/cloudinary.js';

const detector = new DeviceDetector();

export const signup = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    if (!email || !password || !firstName || !lastName) {
			throw new Error("All fields are required");
		}

    const { success } = signUpSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: 'Invalid Inputs' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already taken' });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    const name = `${firstName} ${lastName}`;
    const htmlContent = otpTemplate(verificationToken, name);
    await mailsender(email, "PayZoid: Here's the verification code you requested", htmlContent);

    const user = new User({
      email,
      firstName,
      lastName,
      verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
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
    delete userResponse.password;

    const userAgent = req.headers['user-agent'];
    const detectedDevice = detector.detect(userAgent);

    await userLog.create({
      userId,
      activityType: 'Signup',
      os: detectedDevice.os ? detectedDevice.os.name : 'Unknown OS',
      browser: detectedDevice.client ? detectedDevice.client.name : 'Unknown Browser',
      device: detectedDevice.device ? detectedDevice.device.type : 'Unknown Device',
    });

    return res.status(200).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.log('Error in signup', error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { success } = signinSchema.safeParse({ email, password });

    if (!success) {
      return res.status(400).json({ message: 'Invalid Inputs' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User doesn't exist" });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const userId = user._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    const account = await Account.findOne({ userId });
    const userResponse = user.toObject();

    userResponse.balance = account.balance;
    delete userResponse.password;

    const userAgent = req.headers['user-agent'];
    const detectedDevice = detector.detect(userAgent);

    await userLog.create({
      userId,
      activityType: 'Login',
      os: detectedDevice.os ? detectedDevice.os.name : 'Unknown OS',
      browser: detectedDevice.client ? detectedDevice.client.name : 'Unknown Browser',
      device: detectedDevice.device ? detectedDevice.device.type : 'Unknown Device',
    });

    return res.status(200).json({
      success: true,
      message: 'Login Successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const checkAuth = async (req, res) => {
	try {
    const userId = req.userId;
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

    const account = await Account.findOne({ userId });
    const userResponse = user.toObject();

    userResponse.balance = account.balance;

		res.status(200).json({ success: true, user: userResponse });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const account = await Account.findOne({ userId: req.userId });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const userResponse = user.toObject();
    userResponse.balance = account.balance;

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getUserLogs = async (req, res) => {
  try {
    const userId = req.userId;
    const userLogs = await userLog.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, userLogs });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteUserLog = async (req, res) => {
  try {
    const userId = req.userId;
    const logId = req.params.id;
    await userLog.findOneAndDelete({ _id: logId, userId });
    res.status(200).json({ message: 'User log deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getRecipentant = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      _id: user._id,
    };

    res.status(200).json({ user: userResponse });
  } catch (error) {
    return res.status(401).json({ message: 'Server Error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      gender,
      bio,
      country,
      city,
      postalcode,
      taxid
    } = req.body;

    const { success, error } = updateUserSchema.safeParse(req.body);
    if (!success) {
        console.log('Validation errors:', error.flatten());
        return res.status(400).json({ 
            message: 'Invalid Inputs', 
            errors: error.flatten()
        });
    }

    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (phone) updateFields.phone = phone;
    if (gender) updateFields.gender = gender;
    if (bio) updateFields.bio = bio;
    if (country) updateFields.country = country;
    if (city) updateFields.city = city;
    if (postalcode) updateFields.postalcode = postalcode;
    if (taxid) updateFields.taxid = taxid;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User update failed' });
    }

    const { password: _, ...userResponse } = updatedUser.toObject();

    res.status(200).json({ message: 'User updated successfully', user: userResponse });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const changeAvatar = async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image data provided",
      });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
      });
    }

    const result = await cloudinary.uploader.upload(file.path, {
        folder: 'payzoid/avatars',
        resource_type: 'image',
    });

    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { avatar: result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: {
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Error uploading image:", err);
    return res.status(500).json({
      success: false,
      message: "Error uploading image. Please try again.",
    });
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
        {
          email: {
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
        avatar: user.avatar,
      })),
    });
  } catch (error) {
    return res.status(401).json({ message: 'Server Error' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    await Notification.deleteMany({ userId });
    res.status(200).json({ message: 'Cleared all notifications deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
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
