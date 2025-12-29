import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import {
  signUpSchema,
  signinSchema,
  updateUserSchema,
} from "../utils/zodSchemas.js";
import jwt from "jsonwebtoken";
import { otpTemplate } from "../utils/mailTemplates/otpVerification.template.js";
import { mailsender } from "../utils/mailSender.js";
import DeviceDetector from "node-device-detector";
import cloudinary from "../utils/cloudinary.js";

const detector = new DeviceDetector();

export const signup = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    if (!email || !password || !firstName || !lastName) {
      throw new Error("All fields are required");
    }

    const { success } = signUpSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Invalid Inputs" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email already taken" });
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const name = `${firstName} ${lastName}`;
    const htmlContent = otpTemplate(verificationToken, name);
    await mailsender(
      email,
      "PayZoid: Here's the verification code you requested",
      htmlContent
    );

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    const account = await prisma.account.create({
      data: {
        userId: user.id,
        balance: Math.floor(Math.random() * 90000) + 10000,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      balance: parseFloat(account.balance),
    };

    const userAgent = req.headers["user-agent"];
    const detectedDevice = detector.detect(userAgent);

    await prisma.userLog.create({
      data: {
        userId: user.id,
        activityType: "Signup",
        os: detectedDevice.os ? detectedDevice.os.name : "Unknown OS",
        browser: detectedDevice.client
          ? detectedDevice.client.name
          : "Unknown Browser",
        device: detectedDevice.device
          ? detectedDevice.device.type
          : "Unknown Device",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Account created successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.log("Error in signup", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { success } = signinSchema.safeParse({ email, password });

    if (!success) {
      return res.status(400).json({ message: "Invalid Inputs" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "User doesn't exist" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const account = await prisma.account.findUnique({
      where: { userId: user.id },
    });

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      avatar: user.avatar,
      balance: account ? parseFloat(account.balance) : 0,
    };

    const userAgent = req.headers["user-agent"];
    const detectedDevice = detector.detect(userAgent);

    await prisma.userLog.create({
      data: {
        userId: user.id,
        activityType: "Login",
        os: detectedDevice.os ? detectedDevice.os.name : "Unknown OS",
        browser: detectedDevice.client
          ? detectedDevice.client.name
          : "Unknown Browser",
        device: detectedDevice.device
          ? detectedDevice.device.type
          : "Unknown Device",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        avatar: true,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const account = await prisma.account.findUnique({
      where: { userId },
    });

    const userResponse = {
      ...user,
      balance: account ? parseFloat(account.balance) : 0,
    };

    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: code,
        verificationTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired verification code",
        });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    const userResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      isVerified: updatedUser.isVerified,
    };

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: userResponse,
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const account = await prisma.account.findUnique({
      where: { userId: req.userId },
    });

    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      phone: user.phone,
      gender: user.gender,
      bio: user.bio,
      avatar: user.avatar,
      country: user.country,
      city: user.city,
      postalcode: user.postalcode,
      taxid: user.taxid,
      balance: parseFloat(account.balance),
    };

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserLogs = async (req, res) => {
  try {
    const userId = req.userId;
    const userLogs = await prisma.userLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });
    res.status(200).json({ success: true, userLogs });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUserLog = async (req, res) => {
  try {
    const userId = req.userId;
    const logId = req.params.id;

    await prisma.userLog.deleteMany({
      where: {
        id: logId,
        userId,
      },
    });

    res.status(200).json({ message: "User log deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getRecipentant = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      id: user.id,
    };

    res.status(200).json({ user: userResponse });
  } catch (error) {
    return res.status(401).json({ message: "Server Error" });
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
      taxid,
    } = req.body;

    const { success, error } = updateUserSchema.safeParse(req.body);
    if (!success) {
      console.log("Validation errors:", error.flatten());
      return res.status(400).json({
        message: "Invalid Inputs",
        errors: error.flatten(),
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

    const existingUser = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isDefaultAvatar = existingUser.avatar?.includes(
      "https://avatar.iran.liara.run/public/"
    );
    if (!existingUser.avatar || isDefaultAvatar) {
      if (gender === "Male") {
        updateFields.avatar = `https://avatar.iran.liara.run/public/boy`;
      } else if (gender === "Female") {
        updateFields.avatar = `https://avatar.iran.liara.run/public/girl`;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: updateFields,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User update failed" });
    }

    const userAgent = req.headers["user-agent"];
    const detectedDevice = detector.detect(userAgent);

    await prisma.userLog.create({
      data: {
        userId: req.userId,
        activityType: "Updated Profile",
        os: detectedDevice.os ? detectedDevice.os.name : "Unknown OS",
        browser: detectedDevice.client
          ? detectedDevice.client.name
          : "Unknown Browser",
        device: detectedDevice.device
          ? detectedDevice.device.type
          : "Unknown Device",
      },
    });

    const userResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      isVerified: updatedUser.isVerified,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      country: updatedUser.country,
      city: updatedUser.city,
      postalcode: updatedUser.postalcode,
      taxid: updatedUser.taxid,
    };

    res
      .status(200)
      .json({ message: "User updated successfully", user: userResponse });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
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

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
      });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "payzoid/avatars",
      resource_type: "image",
    });

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { avatar: result.secure_url },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userAgent = req.headers["user-agent"];
    const detectedDevice = detector.detect(userAgent);

    await prisma.userLog.create({
      data: {
        userId: req.userId,
        activityType: "Avatar Change",
        os: detectedDevice.os ? detectedDevice.os.name : "Unknown OS",
        browser: detectedDevice.client
          ? detectedDevice.client.name
          : "Unknown Browser",
        device: detectedDevice.device
          ? detectedDevice.device.type
          : "Unknown Device",
      },
    });

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
    const filter = req.query.filter || "";

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: filter,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: filter,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: filter,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    });

    res.json({
      user: users.map((user) => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        avatar: user.avatar,
      })),
    });
  } catch (error) {
    return res.status(401).json({ message: "Server Error" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    await prisma.notification.deleteMany({
      where: { userId },
    });
    res
      .status(200)
      .json({ message: "Cleared all notifications deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.userId },
    });
    res.status(200).json({ message: "User deleted Successfully" });
  } catch (error) {
    return res.status(401).json({ message: "Server Error" });
  }
};
