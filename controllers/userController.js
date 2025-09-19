import { validationResult } from "express-validator";
import HttpError from "../middlewares/httpError.js";
import User from "../models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

// View Profile
export const viewProfile = async (req, res, next) => {
  try {
    const userId = req.userData.user_id;
    const user = await User.findById(userId).select('-password -receiveNotification');

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
     console.error("View profile error:", err);
    return next(new HttpError("Server error", 500));
  }
};

//view user by admin
export const viewUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -receiveNotification");

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    console.error("View user by ID error:", err);
    return next(new HttpError("Server error", 500));
  }
};

// edit profile
export const editProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const userId = req.userData.user_id;
    const { name, email, age, phone, password } = req.body;

    let skills = req.body.skills;
    let interests = req.body.interests;

    if (typeof skills === "string") {
      try {
        skills = JSON.parse(skills);
      } catch {
        skills = [];
      }
    }

    if (typeof interests === "string") {
      try {
        interests = JSON.parse(interests);
      } catch {
        interests = [];
      }
    }

    const imagePath = req.file ? `/uploads/others/${req.file.filename}` : null;

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (email !== undefined) updatedData.email = email;
    if (age !== undefined) updatedData.age = age;
    if (phone !== undefined) updatedData.phone = phone;
    if (skills !== undefined) updatedData.skills = skills;
    if (interests !== undefined) updatedData.interests = interests;
    if (imagePath) updatedData.image = imagePath;

    if (password && password.trim() !== "" && password !== "undefined") {
      const hashedPassword = await bcrypt.hash(password, 12);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    ).select("-password -receiveNotification");

    if (!updatedUser) {
      return next(new HttpError("User not found", 404));
    }

    const token = jwt.sign(
      { id: updatedUser._id, role: updatedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );

    res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      data: updatedUser,
      token,
    });
  } catch (error) {
    console.error(error, 'error......');
    return next(new HttpError("Server error", 500));
  }
};



// listAllProfile
export const listAllProfile = async (req, res, next) => {
  try {
    const role = req.userData.user_role;

    if (role !== 'admin') { 
      return next(new HttpError("You are not authorized to view this page", 403));
    }

    const users = await User.find().select('-password -receiveNotification' );

    if (!users || users.length === 0) {
      return next(new HttpError('No users found', 404));
    }

    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    next(new HttpError("Failed to fetch profiles", 500));
  }
};

//delete a profile
export const deleteUserProfile = async (req,res,next) => {
  try{
    const userId = req.userData.user_id
    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false }, 
      { isDeleted: true },
      { new: true }
    );
    if (!user) {
      return next (new HttpError("User not found", 404))
    }
    res.status(200).json({
    message: "User  deleted",
    data: user,
  });
  } catch (err) {
    return next (new HttpError("Failed to delete" ,500))

  }
}

// Notification button
export const toggleReceiveNotification = async (req, res, next) => {
  try {
    const userId = req.userData.user_id;

    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError('User not found', 404));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { receiveNotification: !user.receiveNotification },
      { new: true } 
    );

    res.status(200).json({
      status: true,
      message: `Notifications ${updatedUser.receiveNotification ? 'enabled' : 'disabled'} successfully`,
      data: updatedUser.receiveNotification,
    });
  } catch (err) {
    console.error('Toggle notification error:', err);
    return next(new HttpError('Failed to update notification setting', 500));
  }
};
