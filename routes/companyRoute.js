import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { addCompany } from "../controllers/companyController.js";

const companyRouter = Router()

companyRouter.use(userAuthCheck)

companyRouter.post('/addcompany', addCompany)

export default companyRouter;