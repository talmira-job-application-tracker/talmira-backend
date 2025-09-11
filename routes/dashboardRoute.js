import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { getCounts } from "../controllers/dashboardController.js"; 

const dashboardRouter = Router();

dashboardRouter.get("/counts", getCounts);

export default dashboardRouter;
