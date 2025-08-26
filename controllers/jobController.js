import { validationResult } from "express-validator";
import HttpError from '../middlewares/httpError.js';
import Job from '../models/jobs.js'
import Company from "../models/company.js";
import User from "../models/users.js";
import transporter from "../utils/mailer.js";
import Subscription from "../models/subscription.js";
import Alert from "../models/notification.js";

// //list
export const listJob = async (req, res, next) => {
  try {
    const { title, location, jobType, workMode, keyword, query: search } = req.query;

    let query = {};

    if (title) {
      query.title = { $regex: title.trim(), $options: "i" };
    }

    if (location) {
      query.location = { $regex: location.trim(), $options: "i" };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (keyword) {
      query.keyword = { $in: [new RegExp(keyword.trim(), "i")] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { location: { $regex: search.trim(), $options: "i" } },
        { jobType: { $regex: search.trim(), $options: "i" } },
        { workMode: { $regex: search.trim(), $options: "i" } },
        { qualification: { $regex: search.trim(), $options: "i" } },
        { language: { $elemMatch: { $regex: search.trim(), $options: "i" } } },
        { keyword: { $elemMatch: { $regex: search.trim(), $options: "i" } } },
      ];

      const companies = await Company.find({
        name: { $regex: search.trim(), $options: "i" },
      }).select("_id");

      if (companies.length > 0) {
        query.$or.push({ company: { $in: companies.map((c) => c._id) } });
      }
    }

    const listedJobs = await Job.find(query)
      .select(
        "title description company location jobType salary language qualification keyword workMode"
      )
      .populate({
        path: "company",
        select: "name",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Job fetched successfully",
      data: listedJobs,
    });
  } catch (err) {
    console.error("Search Job Error Stack:", err);
    return next(new HttpError("Error fetching jobs", 500));
  }
};



//view
export const viewJob = async ( req, res, next ) => {
    try{
        const {id} = req.params

        let getJob = await Job.findById(id)
        .select("title description company location jobType salary language qualification keyword workMode")
        .populate({
            path: "company",
            select: "name"
        });

        if(!getJob) {
            return next(new HttpError("Job not found", 404));
        }

        res.status(200).json({
            status: true,
            message: "success",
            data: getJob
        });
        console.log(getJob)

    } catch (err){
        return next(new HttpError("Failed to fetch job details", 500));
    }
}


//add
export const addJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(errors.array()[0].msg, 422));
    }

    const { user_role } = req.userData;
    if (user_role !== "admin") {
      return next(new HttpError("Access Denied", 402));
    }

    const {
      title,
      description,
      company,
      location,
      jobType,
      salary,
      language,
      qualification,
      keyword,
      workMode,
    } = req.body;

   
    const existingCompany = await Company.findOne({ _id: company, isDeleted: false });
    if (!existingCompany) {
      return next(new HttpError("Company not found or is deleted", 404));
    }
    
    const languages = Array.isArray(language)
  ? language
  : language?.split(",").map(l => l.trim()) || [];

const jobKeywords = Array.isArray(keyword)
  ? keyword.map(k => k.trim().toLowerCase())
  : keyword?.split(",").map(k => k.trim().toLowerCase()) || [];

const addedJob = await new Job({
  title,
  description,
  company: existingCompany._id,
  location,
  jobType,
  salary,
  language: languages,
  qualification,
  keyword: jobKeywords,
  workMode,
}).save();


//EMAIL to subscribers
    const subscriptions = await Subscription.find({ companyId: addedJob.company }).select("userId");
    const subscribedUserIds = subscriptions.map(sub => sub.userId.toString());

    const subscribedUsers = await User.find({ _id: { $in: subscribedUserIds } }).select("email name");

    for (let user of subscribedUsers) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `New Job Posted at ${existingCompany.name}`,
        template: "jobAlert",
        context: {
          name: user.name,
          title,
          company: existingCompany.name,
          location,
          link: `https://localhost:3000/job/${addedJob._id}`,
        },
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Failed to email ${user.email}:`, error);
        }
      });
    }

    //in-app notification: matching skills/interests
    const skillMatchedUsers = await User.find({
      $or: [
        { skills: { $in: jobKeywords } },
        { interests: { $in: jobKeywords } }
      ]
    }).select("_id");

    for (let user of skillMatchedUsers) {
        await Alert.create({
            userId: user._id,
            jobId: addedJob._id,
            message: `New job matches your skills/interests: ${title} at ${existingCompany.name}`,
            keywords: jobKeywords,
            location: location,
            skills: [], //  add matched skills 
        });
    }

    res.status(201).json({
      status: true,
      message: "Successfully added job and notified users",
      data: addedJob,
    });

  } catch (err) {
    console.error("Job creation failed:", err);
    return next(new HttpError("Job Creation Failed", 500));
  }
};


//edit
export const editJob = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return next(new HttpError(errors.array()[0].msg, 422));
        }

        const {id} = req.params
        const {user_role} = req.userData
        const {
                title, 
                description,
                location, 
                jobType, 
                salary, 
                language, 
                qualification, 
                keyword, 
                workMode
            } = req.body

        if(user_role !== "admin") {
            return next(new HttpError("Access Denied, only admins can edit", 403));
        }

        const languages = Array.isArray(language)
          ? language
          : language?.split(",").map(l => l.trim().toLowerCase()) || [];

        const jobKeywords = Array.isArray(keyword)
          ? keyword.map(k => k.trim().toLowerCase())
          : keyword?.split(",").map(k => k.trim().toLowerCase()) || [];

        const updatedJob = {
          title,
          description,
          location,
          jobType,
          salary,
          language: languages,
          qualification,
          keyword: jobKeywords,
          workMode
        };

        // if (company) {
        //   const existingCompany = await Company.findOne({ _id: company, isDeleted: false });
        //   if (!existingCompany) {
        //     return next(new HttpError("Company not found or is deleted", 404));
        //   }
        //   updatedJob.company = existingCompany._id;
        // }

        const editedJob = await Job.findOneAndUpdate(
          { _id: id },
          updatedJob,
          { new: true }
        );

         if(!editedJob){
            return next(new HttpError(' Job not found ',404));
        }

        res.status(200).json({
            status: true,
            message: "Job updated",
            data: editedJob
        })
    } catch (err) {
        console.error("Edit Book Error:", err)
        return next(new HttpError("Error occurred ", 500))
    }
};

//delete
export const deleteJob = async(req, res, next) => {
    try{
        const {id} = req.params
        const {user_role} = req.userData

        if(user_role !== "admin"){
            return next(new HttpError("Access Denied, only admins can delete", 403));
        }

        const del = await Job.findOneAndDelete({_id: id})

        if(!del) {
            return next(new HttpError("Job not found", 404));
        }

        res.status(202).json({
            status: true,
            message: "successfully deleted",
            data:""
        })

    } catch (err) {
        return next(new HttpError("Error deleting Job", 500));
    }
};