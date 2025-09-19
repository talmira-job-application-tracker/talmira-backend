import HttpError from "../middlewares/httpError.js";
import Subscription from "../models/subscription.js";

//admin list all subs-users under each company
export const subscribedUsers = async (req , res, next) => {
    try{
        const {user_role} = req.userData
        const {companyId} = req.params

        if(user_role !== "admin") {
            return next(new HttpError("Only admins can view", 403));
        }

        const subscribers = await Subscription.find({companyId, isActive: true})
        .populate("userId", "name email image");

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
  try {
    const { user_id } = req.userData;

    const subscriptions = await Subscription.find({ userId: user_id, isActive: true })
      .populate("companyId", "name industry description location website logo email");

    const companies = subscriptions.map(sub => sub.companyId);

    res.status(200).json({
      status: true,
      message: "Successfully listed",
      data: companies   
    });

  } catch (err) {
    return next(new HttpError("Error fetching list", 500));
  }
};



//subscribe button
export const toggleSubscription = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const userId = req.userData.user_id;

        let subscription = await Subscription.findOne({ userId, companyId });

        if (!subscription) {
            subscription = await Subscription.create({
                userId,
                companyId,
                isActive: true,
                subscribedAt: new Date()
            });

            return res.status(201).json({
                status: true,
                action: "subscribed",
                message: "Subscribed successfully",
                data: subscription
            });
        }

        // If already active unsubscribe
        if (subscription.isActive) {
            subscription.isActive = false;
            subscription.unsubscribedAt = new Date();
            await subscription.save();

            return res.status(200).json({
                status: true,
                action: "unsubscribed",
                message: "Unsubscribed successfully"
            });
        }

        // If inactive resubscribe
        subscription.isActive = true;
        subscription.subscribedAt = new Date();
        subscription.unsubscribedAt = null;
        await subscription.save();

        return res.status(200).json({
            status: true,
            action: "resubscribed",
            message: "Subscribed successfully",
            data: subscription
        });

    } catch (err) {
        console.error("Toggle subscription error", err);
        next(new HttpError("Subscription toggle failed", 500));
    }
};




