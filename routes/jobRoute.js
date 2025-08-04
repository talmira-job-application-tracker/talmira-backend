import { Router } from "express";
import { listJob } from "../controllers/jobController.js";
import userAuthCheck from "../middlewares/authCheck.js";

const jobRouter = Router()
jobRouter.use(userAuthCheck)

jobRouter.get('/list', listJob);

export default jobRouter