// src/controllers/auth.controller.js

import bcrypt from "bcrypt";
import { Op } from "sequelize";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import resetPasswordTemplate from "../emails/resetPassword.template.js";
import welcomeTemplate from "../emails/welcome.template.js";

// export const registerUser = async (req, res) => {
//   try {
//     const { firstName, lastName, email, phone, password } = req.body;

//     // Check Email
//     const existingEmail = await User.findOne({
//       where: { email },
//     });

//     if (existingEmail) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already exists",
//       });
//     }

//     // Check Phone
//     const existingPhone = await User.findOne({
//       where: { phone },
//     });

//     if (existingPhone) {
//       return res.status(409).json({
//         success: false,
//         message: "Phone number already exists",
//       });
//     }

//     // Hash Password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create User
//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       phone,
//       password: hashedPassword,
//     });

//     const { password: _, ...userData } = user.toJSON();


//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully.",
//       data: user,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check Email
    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Check Phone
    const existingPhone = await User.findOne({
      where: { phone },
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    // Remove Password From Response
    const { password: _, ...userData } = user.toJSON();

    // Send Welcome Email
    try {
      const message = welcomeTemplate(user.firstName);

      await sendEmail({
        email: user.email,
        subject: "🎉 Welcome to Crowdfunding Platform",
        message,
      });
    } catch (error) {
      console.error("Welcome Email Error:", error.message);
    }

    // Create Welcome Notification
    try {
      await sendNotification({
        userId: user.id,
        title: "Welcome 🎉",
        message:
          "Welcome to Crowdfunding Platform. We're excited to have you onboard!",
        type: "system",
      });
    } catch (error) {
      console.error("Notification Error:", error.message);
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: userData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check User
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare Password
    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Remove Password From Response
    const { password: _, ...userData } = user.toJSON();

    // Generate JWT Token
    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
      token,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check User
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token Expiry (10 Minutes)
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    // Save Token & Expiry
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpire,
    });

    // Reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email Template
    const message = resetPasswordTemplate(
      user.firstName,
      resetUrl
    );
    
    // Send Email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message
    });

    
    return res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpire: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has expired.",
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    });

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};