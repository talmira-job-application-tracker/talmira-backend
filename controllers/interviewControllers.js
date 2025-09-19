import HttpError from "../middlewares/httpError.js";
import Application from "../models/application.js";
import Interview from "../models/interviews.js";
import Alert from "../models/notification.js";

// schedule interview
export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, scheduledAt, mode, location, notes } = req.body;

    if (req.userData.user_role !== "admin") {
      return res.status(403).json({ message: "Only admins can schedule interviews" });
    }

    const application = await Application.findById(applicationId)
      .populate({
        path: "job",
        populate: { path: "company" },
      })
      .populate("user");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (!application.job || !application.job.company) {
      return res
        .status(400)
        .json({ message: "Job or company details missing in application" });
    }

    const interview = await Interview.create({
      application: application._id,
      scheduledAt,
      mode,
      location,
      notes,
    });

    const populatedInterview = await Interview.findById(interview._id)
      .populate({
        path: "application",
        populate: [
          { path: "user", select: "name email phone" },
          { path: "job", populate: { path: "company", select: "name" } }
        ]
      });

    // IN-APP ALERT
    await Alert.create({
      userId: application.user._id,
      jobId: application.job._id,
      interviewId: interview._id,
      message: `Your interview for ${application.job.title} at ${application.job.company.name} has been scheduled on ${new Date(
        scheduledAt
      ).toLocaleString()}.`,
      link: `/interview/${interview._id}`,
      isRead: false,
    });

    res.status(201).json({
      status: true,
      message: "Interview scheduled successfully and in-app alert created",
      interview: populatedInterview,
    });
  } catch (error) {
    console.error("Schedule interview failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// list interviews
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate({
        path: "application",
        populate: [
          { path: "user", select: "name email phone" },
          { path: "job", populate: { path: "company", select: "name" } }
        ]
      });
    res.status(200).json({ data: interviews });
  } catch (err) {
    res.status(500).json({ message: "Error fetching interviews" });
  }
};

// view interview
export const viewInterview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const getInterview = await Interview.findById(id)
      .populate({
        path: "application",
        populate: [
          { path: "user", select: "name email phone" },
          { path: "job", populate: { path: "company", select: "name" } }
        ]
      });

    if (!getInterview) {
      return next(new HttpError("Interview not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "success",
      data: getInterview,
    });
  } catch (err) {
    return next(new HttpError("Failed to fetch interview details", 500));
  }
};

