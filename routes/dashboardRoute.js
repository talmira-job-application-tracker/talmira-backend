import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { getCounts } from "../controllers/dashboardController.js"; 

const dashboardRouter = Router();

dashboardRouter.use(userAuthCheck);

dashboardRouter.get("/counts", getCounts);

export default dashboardRouter;
