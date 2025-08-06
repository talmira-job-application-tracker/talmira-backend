import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { uploadResume } from "../middlewares/upload.js";
import { createApplication } from "../controllers/applicationController.js";

const applicationRouter = Router();
applicationRouter.use(userAuthCheck);

applicationRouter.post('/apply/:id', uploadResume.single("resume"),createApplication);

export default applicationRouter


