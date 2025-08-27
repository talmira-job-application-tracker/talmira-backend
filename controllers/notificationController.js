
import Alert from '../models/notification.js';
import HttpError from '../middlewares/httpError.js';
import User from '../models/users.js';

//listalerts
export const listAlerts = async (req, res, next) => {
  try {
    const userId = req.userData.user_id; 
    console.log("Fetching alerts for user:", userId);


    let alerts = await Alert.find({
      userId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "jobId",
        select: "title description location jobType workMode",
      });

    // Remove alerts with deleted jobs
    alerts = alerts.filter(a => a.jobId);

    if (!alerts.length) {
      return res.status(200).json({
        status: true,
        message: "No alerts found",
        data: [],
      });
    }

    res.status(200).json({
      status: true,
      message: "Fetched alerts successfully",
      data: alerts,
    });

  } catch (err) {
    console.error("Error fetching alerts", err);
    return next(new HttpError("Failed to fetch alerts", 500));
  }
};





//delete alerts
export const deleteAlert = async (req,res,next) => {
    try{
      const userId = req.userData.user_id;
      const alertId = req.params.id

      const deletedAlert = await Alert.findOneAndUpdate(
      { _id: alertId, userId: userId }, 
      { isDeleted: true },
      { new: true }
    );


      if (!deletedAlert) {
        return next(new HttpError("Alert not found or not yours", 404));
      } else {
        res.status(200).json({
          status:true,
          message:'Alert deleted Successfully!',
           data: deletedAlert
        })
      }

    } catch (err) {
      console.error(err)
      return next (new HttpError('Failed to delete alert',500))
        
    }
}

// viewUnreadAlerts
export const viewUnreadAlerts = async (req, res, next) => {
  try {
    const userId = req.userData.user_id;

    const unreadAlerts = await Alert.find({
      userId,
      isRead: false,
      isDeleted: false ,
    }).sort({ createdAt: -1 });

    //mark them as read

    if (unreadAlerts.length > 0) {
      await Alert.updateMany(
        { userId, isRead: false },
        { $set: { isRead: true } }
      );
    }

    res.status(200).json({
      success: true,
      count: unreadAlerts.length,
      alerts: unreadAlerts
    });

  } catch (err) {
    next(new HttpError("Failed to fetch unread alerts", 500));
  }
};
