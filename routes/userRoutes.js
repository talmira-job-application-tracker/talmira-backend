import express from 'express'
import { deleteUserProfile, editProfile,  listAllProfile,    toggleReceiveNotification,    viewProfile } from '../controllers/userController.js'
import userAuthCheck from '../middlewares/authCheck.js'
import { uploadLogo } from '../middlewares/upload.js'
import { check } from 'express-validator'
 
const userRouter = express.Router()

userRouter.use(userAuthCheck)

userRouter.get('/view',viewProfile)

userRouter.patch("/edit",uploadLogo.single("image"),[
    check("name").optional().trim(),

    check("email")
      .optional()
      .isEmail().withMessage("Invalid email format"),

    check("role")
      .optional()
      .isIn(["admin", "user"]).withMessage("Role must be admin or user"),

    check("age")
   .optional({ checkFalsy: true })    //check null
   .isInt({ min: 0 }).withMessage("Age must be a positive number"),

    check("password")
      .optional()
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    check("phone")
      .optional()
      .matches(/^[0-9]{10}$/).withMessage("Phone must be a valid 10-digit number"),

    check("skills")
      .optional()
      .custom((val) => {
        if (typeof val === "string") return true; // frontend sends CSV string
        if (Array.isArray(val)) return true; // frontend sends array
        throw new Error("Skills must be a string or array");
      }),

    check("interests")
      .optional()
      .custom((val) => {
        if (typeof val === "string") return true;
        if (Array.isArray(val)) return true;
        throw new Error("Interests must be a string or array");
      }),

    check("receiveNotification").optional().isBoolean(),
  ],
  editProfile
);

userRouter.get('/list', listAllProfile)
userRouter.delete('/delete',deleteUserProfile)
userRouter.patch("/togglenotification",  toggleReceiveNotification);


 export default userRouter