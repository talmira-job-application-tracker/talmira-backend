import { Router } from "express";
import { addJob, deleteJob, editJob, listJob, viewJob } from "../controllers/jobController.js";
import userAuthCheck from "../middlewares/authCheck.js";
import { check } from "express-validator";

const jobRouter = Router()
jobRouter.use(userAuthCheck)

jobRouter.get('/list', listJob);
jobRouter.get('/:id', viewJob);

jobRouter.post('/add', [
  check("title")
    .notEmpty().withMessage("Job title required"),

  check("description")
    .notEmpty().withMessage("Job description required"),

  check("company")
    .notEmpty().withMessage("Company ID required"),

  check("location")
    .notEmpty().withMessage("Location required"),

  check("jobType")
    .notEmpty().withMessage("Job type required")
    .isIn(["Full-time", "Part-time", "Internship"]).withMessage("Invalid job type"),

  check("salary")
    .notEmpty().withMessage("Salary required"),

  check("language")
    .optional()
    .isArray().withMessage("Language must be an array"),

  check("qualification")
    .notEmpty().withMessage("Qualification field required"),

  check("keyword")
    .isArray({ min: 1 }).withMessage("Keyword must be a non-empty array"),

  check("workMode")
    .optional()
    .isIn(["Hybrid", "On-Site", "Remote"]).withMessage("Invalid work mode"),
], addJob);


jobRouter.patch('/:id', 
[
  check("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 2 }).withMessage("Title must be at least 2 characters"),

  check("description")
    .notEmpty().withMessage("Description is required"),

  check("location")
    .notEmpty().withMessage("Location is required"),

  check("jobType")
    .notEmpty().withMessage("Job type is required")
    .isIn(["Full-time", "Part-time", "Contract", "Internship"]).withMessage("Invalid job type"),

  check("salary")
    .notEmpty().withMessage("Salary is required"),

  check("language")
    .optional().isArray().withMessage("Language must be an array"),

  check("qualification")
    .notEmpty().withMessage("Qualification is required"),

  check("keyword")
    .isArray({ min: 1 }).withMessage("Keyword must be a non-empty array"),

  check("workMode")
    .notEmpty().withMessage("Work mode is required")
    .isIn(["Hybrid", "On-Site", "Remote"]).withMessage("Invalid work mode")
], editJob);

jobRouter.delete('/:id', deleteJob);


export default jobRouter