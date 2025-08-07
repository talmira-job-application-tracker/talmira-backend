import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { subscribedCompanies, subscribedUsers, subscribeToCompany } from "../controllers/subscriptionController.js";

const subscriptionRouter = Router();
subscriptionRouter.use(userAuthCheck);

subscriptionRouter.post('/subscribe/:companyId', subscribeToCompany);
subscriptionRouter.get('/:companyId/subscribers', subscribedUsers);
subscriptionRouter.get('/subcompanies', subscribedCompanies);

export default subscriptionRouter;

