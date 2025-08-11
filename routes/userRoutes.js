import express from 'express'
import { deleteUserProfile, editProfile,  listAllProfile,    toggleReceiveNotification,      viewProfile } from '../controllers/userController.js'
import userAuthCheck from '../middlewares/authCheck.js'
import { uploadLogo } from '../middlewares/upload.js'
 
const userRouter = express.Router()

userRouter.use(userAuthCheck)

userRouter.get('/viewprofile',viewProfile)
userRouter.patch('/editprofile',uploadLogo.single('image'),
  [
    check("name")
      .notEmpty().withMessage("Name is required")
      .trim(),

    check("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format"),

    check("role")
      .notEmpty().withMessage("Role is required")
      .isIn(["admin", "user"]).withMessage("Role must be admin or user"),

    check("age")
      .notEmpty().withMessage("Age is required")
      .isInt({ min: 0 }).withMessage("Age must be a positive number"),

    check("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    check("phone")
      .notEmpty().withMessage("Phone is required")
      .matches(/^[0-9]{10}$/).withMessage("Phone must be a valid 10-digit number"),

    check("skills")
      .notEmpty().withMessage("Skills are required"),

    check("interests")
      .notEmpty().withMessage("Interests are required"),

    check("isDeleted")
      .notEmpty().withMessage("isDeleted is required"),

    check("receiveNotification")
      .notEmpty().withMessage("receiveNotification is required"),
  ],
  editProfile
);

userRouter.get('/listallusers', listAllProfile)
userRouter.delete('/deleteprofile/:id',deleteUserProfile)
userRouter.patch("/togglenotification",  toggleReceiveNotification);


 export default userRouter