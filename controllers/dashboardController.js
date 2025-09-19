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


export const getApplicationsOverTime = async (req, res) => {
  try {
    const results = await Application.aggregate([
      {
        $group: {
          _id: { $month: "$appliedAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const formatted = results.map(r => ({
      month: monthNames[r._id - 1],
      count: r.count
    }));

    res.status(200).json({ status: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Failed to fetch applications over time" });
  }
};


export const getJobsByIndustry = async (req, res) => {
  try {
    const jobsByIndustry = await Job.aggregate([
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "companyData"
        }
      },
      { $unwind: "$companyData" },
      {
        $group: {
          _id: { $ifNull: ["$companyData.industry", "Uncategorized"] },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count"
        }
      }
    ]);

    res.status(200).json({
      status: true,
      data: jobsByIndustry
    });
  } catch (err) {
    console.error("Failed to fetch jobs by industry", err);
    res.status(500).json({
      status: false,
      message: "Failed to fetch jobs by industry"
    });
  }
};
