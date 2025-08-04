import HttpError from "../middleware/httpError.js";
import User from "../models/users.js";

// View Profile
export const viewProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Gets the user ID from the authenticated token

    const user = await User.findById(userId).select('-password');
    // Fetches user info from DB but hides the password

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    return next(new HttpError("Server error", 500));
  }
};


