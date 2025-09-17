import { Router } from "express";
import { check, validationResult } from "express-validator";
import userAuthCheck from "../middlewares/authCheck.js";
import { getAllInterviews, scheduleInterview } from "../controllers/interviewControllers.js";

const interviewRouter = Router();

interviewRouter.use(userAuthCheck);

interviewRouter.get('/list',getAllInterviews)
interviewRouter.post(
  "/schedule",
  [
    check("applicationId").notEmpty().withMessage("Application ID is required"),
    check("scheduledAt").notEmpty().withMessage("Scheduled date/time is required"),
    check("mode")
      .notEmpty().withMessage("Mode is required")
      .isIn(["online", "offline"]).withMessage("Mode must be 'online' or 'offline'"),
    check("location").custom((value, { req }) => {
      if (req.body.mode === "offline" && (!value || value.trim() === "")) {
        throw new Error("Location is required for offline interviews");
      }
      return true;
    }),
    check("notes")
      .optional()
      .isLength({ max: 500 }).withMessage("Notes cannot exceed 500 characters"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  scheduleInterview
);



export default interviewRouter;
