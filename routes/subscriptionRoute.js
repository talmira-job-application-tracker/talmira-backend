import { Router } from "express";
import userAuthCheck from "../middlewares/authCheck.js";
import { subscribedCompanies, subscribedUsers, toggleSubscription } from "../controllers/subscriptionController.js";

const subscriptionRouter = Router();
subscriptionRouter.use(userAuthCheck);

// subscriptionRouter.post('/subscribe/:companyId', subscribeToCompany);
subscriptionRouter.patch('/toggle/:companyId', toggleSubscription);
subscriptionRouter.get('/:companyId/subscribers', subscribedUsers);
subscriptionRouter.get('/subs-companies', subscribedCompanies);

export default subscriptionRouter;

