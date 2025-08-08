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

    check("role")
        .notEmpty().withMessage("Role is required")
        .isIn(["admin", "user"]).withMessage("Role must be either admin or user"),

    check("phone")
        .notEmpty().withMessage("Phone number required")
        .matches(/^[0-9]{10}$/).withMessage("Phone must be a valid 10-digit number"),

    check("age")
        .optional()
        .isInt({ min: 0 }).withMessage("Age must be a positive number"),

    check("skills")
        .optional()
        .isArray().withMessage("Skills must be an array of strings"),

    check("interests")
        .optional()
        .isArray().withMessage("Interests must be an array of strings"),

    check("receivenotification")
        .optional()
        .isBoolean().withMessage("receivenotification must be true or false"),

    check("image")
        .notEmpty().withMessage("Image required")
        
], registerUser);
authRouter.post('/login', loginUser);

export default authRouter