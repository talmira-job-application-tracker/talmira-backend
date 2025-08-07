
import Alert from '../models/alert.js';
import HttpError from '../middlewares/httpError.js';

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
