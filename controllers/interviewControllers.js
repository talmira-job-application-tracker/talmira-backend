import Application from "../models/application.js";
import Interview from "../models/interviews.js";
import Alert from "../models/notification.js";

export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, scheduledAt, mode, location, notes } = req.body;

    if (req.userData.user_role !== "admin") {
      return res.status(403).json({ message: "Only admins can schedule interviews" });
    }

    if (!scheduledAt) {
      return res.status(400).json({ message: "Scheduled date/time is required" });
    }

    // Fetch application with job, company, and user populated
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

    // Create interview
    const interview = await Interview.create({
      applicationId,
      jobId: application.job._id,
      companyId: application.job.company._id,
      candidateId: application.user._id,
      scheduledAt,
      mode,
      location,
      notes,
    });

    // Populate job, company, and candidate details for response
    const populatedInterview = await Interview.findById(interview._id)
      .populate("jobId")
      .populate("companyId")
      .populate("candidateId");

    // ----------------------------
    // IN-APP ALERT
    // ----------------------------
    await Alert.create({
      userId: application.user._id,
      jobId: application.job._id,
      interviewId: interview._id, // optional: link alert to interview
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
