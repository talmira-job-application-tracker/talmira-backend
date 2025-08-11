import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { uploadResume } from "../middlewares/upload.js";
import { createApplication, deleteApplication, editApplicationStatus, listApplication, viewApplication } from "../controllers/applicationController.js";
import { check } from "express-validator";

const applicationRouter = Router();
applicationRouter.use(userAuthCheck);

applicationRouter.post('/apply/:id', uploadResume.single("resume"), createApplication);
applicationRouter.get('/list', listApplication);
applicationRouter.patch('/:id/status', editApplicationStatus);
applicationRouter.get('/:id', viewApplication);
applicationRouter.delete('/:id', deleteApplication);

export default applicationRouter


