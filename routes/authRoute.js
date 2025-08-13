import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { uploadLogo } from "../middlewares/upload.js";
import { check } from "express-validator";

const authRouter = Router();

authRouter.post('/register', uploadLogo.single('image'),[

    check("name")
        .notEmpty().withMessage("Name required")
        .isLength({ min: 2 }).withMessage("Must be at least 2 characters"),

    check("email")
        .notEmpty().withMessage("Email required")
        .isEmail().withMessage("Invalid email format"),

    check("password")
        .notEmpty().withMessage("Password required")
        .isLength({ min: 6 }).withMessage("Must at least 6 characters"),

    check("phone")
        .notEmpty().withMessage("Phone number required")
        .matches(/^[0-9]{10}$/).withMessage("Phone must be a valid 10-digit number"),

    check("age")
        .optional()
        .isInt({ min: 0 }).withMessage("Age must be a positive number"),

    check("skills")
        .optional(),

    check("interests")
        .optional(),

    check("receiveNotification")
        .optional()
        .isBoolean().withMessage("receiveNotification must be true or false"),

], registerUser);
authRouter.post('/login', 
[
    check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

    check("password")
    .notEmpty().withMessage('Password Required')
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
], loginUser);

export default authRouter