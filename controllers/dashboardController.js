import Application from "../models/application.js";
import Company from "../models/company.js";
import Job from "../models/jobs.js";
import User from "../models/users.js";

export const getCounts = async (req, res) => {
  try {
    const applicationsCount = await Application.countDocuments();
    const jobsCount = await Job.countDocuments();
    const usersCount = await User.countDocuments({ role: "user", isDeleted: false }); 
    const companiesCount = await Company.countDocuments({ isDeleted: false });

    res.status(200).json({
      status: true,
      data: {
        applications: applicationsCount,
        jobs: jobsCount,
        applicants: usersCount,
        companies: companiesCount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
         status: false,
          message: "Failed to fetch counts" });
  }
};
