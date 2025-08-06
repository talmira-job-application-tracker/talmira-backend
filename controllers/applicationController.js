import Application from "../models/application.js";
import Job from "../models/jobs.js"
import User from "../models/users.js";
import HttpError from "../middlewares/httpError.js"

//add
export const createApplication = async (req, res, next) => {
    try{
        const {id: job_id} = req.params;
        const {user_id} = req.userData;
        const resumePath = req.file.path
        .replace(/^.*uploads[\\/]/, 'uploads/')
        .replace(/\\/g, '/');

        const job = await Job.findById(job_id)
        if(!job) {
            return next(new HttpError("Job not found", 404));
        }

        const user = await User.findById(user_id)
        if(!user) {
            return next(new HttpError("User not found", 404));
        }

        const alreadyApplied = await Application.findOne({ user: user._id, job: job._id });
        if (alreadyApplied) {
            return next(new HttpError("You already applied to this job", 400));
        }

        if(!req.file) return next(new HttpError("Resume required!", 422));

        const application = await new Application({
            user: user._id,
            job: job._id,
            resume: resumePath,
            contactInfo: {
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        }).save();

        res.status(201).json({
            status: true,
            message: "Application submitted successfully",
            data: application
        });
    } catch (err) {
        console.error("Create Application error:", err);
        return next(new HttpError("Failed to submitted", 500));
    }
};

//view
export const viewApplication = async (req, res, next) => {
    try{
         const { id } = req.params;
         const { user_role } = req.userData;

         if (user_role !== "admin") {
            return next(new HttpError("Only admins have access to view", 422));
         }

         let getApplication = await Application.findById(id)
         .select("user job appliedAt resume contactInfo")
         .populate([{
            path: "user",
            select: "name"
         },{
            path: "job",
            select: "title company"
         }])

         if(!getApplication) {
            return next(new HttpError("Application not found", 404));
         }

        res.status(200).json({
            status: true,
            message: "success",
            data: getApplication
        });

    } catch (err) {
        return next(new HttpError("Failed to fetch application details", 500));
    }
}

//list
export const listApplication = async(req, res, next) => {
    try{
        const {user_role} = req.userData;
        if (user_role !== "admin") {
            return next(new HttpError("Only admins have access to view", 422));
         }

        const listedApplications = await Application.find()
        .select("user job appliedAt status resume contactInfo")
        .populate([{
            path: "user",
            select: "name"
         },{
            path: "job",
            select: "title company"
         }])

         if(!listedApplications) {
            return next(new HttpError("No applications found", 404));
         }

        res.status(200).json({
            status: true,
            message: "success",
            data: listedApplications
        });

    } catch(err) {
        return next(new HttpError("Failed to fetch application details", 500));
    }
}