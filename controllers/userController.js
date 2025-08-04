import HttpError from "../middlewares/httpError.js";
import User from "../models/users.js";

// View Profile
export const viewProfile = async (req, res, next) => {
  try {
    const userId = req.userData.user_id;


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
     console.error("View profile error:", err);
    return next(new HttpError("Server error", 500));
  }
};

//editprofile
export const editProfile = async(req,res,next) => {
  try{
     const userId = req.userData.user_id; 
     
     const { name, email,  age, phone } = req.body;

     const updatedData = {
      name,
      email,
      age,
      phone
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true }
    )
    .select("-password"); 
    
     if (!updatedUser) {
      return next(new HttpError("User not found", 404));
    }

      res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    return next(new HttpError("Server error", 500));
  }
}


