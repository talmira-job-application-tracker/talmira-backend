import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { getApplicationsOverTime, getCounts, getJobsByIndustry } from "../controllers/dashboardController.js"; 

const dashboardRouter = Router();

dashboardRouter.get("/counts", getCounts);
dashboardRouter.get("/applications-over-time", getApplicationsOverTime);
dashboardRouter.get("/jobs-by-industry", getJobsByIndustry);

export default dashboardRouter;
