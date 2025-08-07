import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { uploadLogo } from "../middlewares/upload.js";

const authRouter = Router();

authRouter.post('/register', uploadLogo.single('image'), registerUser);
authRouter.post('/login', loginUser);

export default authRouter