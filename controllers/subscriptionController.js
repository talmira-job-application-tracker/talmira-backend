import HttpError from "../middlewares/httpError.js";
import Subscription from "../models/subscription.js";

//create subscription
export const subscribeToCompany = async (req, res, next) => {
    try {
        const {companyId} = req.params;
        const userId = req.userData.user_id;

        const exists = await Subscription.findOne({userId, companyId})
        if (exists) {
            return next(new HttpError("Already subscribed",409));
        }

        const subscription = await Subscription.create({userId, companyId})
        res.status(201).json({ 
            status: true,
            message: "Subscribed successfully", 
            data: subscription
        });
    } catch (err){
        console.error("Subscribe error", err);
        next(new HttpError("Subscription failed", 500));
    }
};

//admin list all users under each company
export const subscribedUsers = async (req , res, next) => {
    try{
        const {user_role} = req.userData
        const {companyId} = req.params

        if(user_role !== "admin") {
            return next(new HttpError("Only admins can view", 403));
        }

        const subscribers = await Subscription.find({companyId})
        .populate("userId", "name email");

        res.status(200).json({
            status: true,
            message: "Successfully fetched",
            data: subscribers
        });

    } catch (err) {
        console.error("Error fetching subscribers", err)
        return next(new HttpError("Error listing subscribers", 500));
    }
};

//users list all the subscribed companies
export const subscribedCompanies = async (req, res, next) => {
    try{
        const {user_id} = req.userData;

        const subscriptions = await Subscription.find({userId: user_id})
        .populate("companyId", "name email");

        res.status(200).json({
            status: true,
            message: "Successfully listed",
            data: subscriptions
        });
    } catch (err) {
        return next(new HttpError("Error fetching list", 500));
    }
}


