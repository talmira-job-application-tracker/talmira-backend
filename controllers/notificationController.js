
import Alert from '../models/notification.js';
import HttpError from '../middlewares/httpError.js';
import User from '../models/users.js';

//listalerts
export const listAlerts = async (req, res, next) => {
  try {
    const userId = req.userData.user_id;

    const alerts = await Alert.find({ userId }).sort({ createdAt: -1 });

    if (!alerts || alerts.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No alerts found",
        data: [],
      });
    }else {

        res.status(200).json({
          status: true,
          message: "Fetched alerts successfully",
          data: alerts,
        });
    }

  } catch (err) {
    console.error("Error fetching alerts", err);
    return next(new HttpError("Failed to fetch alerts", 500));
  }
};


// toggleNotification
export const toggleReceiveNotification = async (req, res, next) => {
  try {
    const userId = req.userData.user_id;

    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError('User not found', 404));
    }

    user.receivenotification = !user.receivenotification;
    await user.save();

    res.status(200).json({
      status: true,
      message: `Notifications ${user.receivenotification ? 'enabled' : 'disabled'} successfully`,
      data: user.receivenotification,
    });
  } catch (err) {
    console.error('Toggle notification error:', err);
    return next(new HttpError('Failed to update notification setting', 500));
  }
};

//delete alerts
export const deleteAlert = async (req,res,next) => {
    try{

    } catch {
        
    }
}