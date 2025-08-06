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