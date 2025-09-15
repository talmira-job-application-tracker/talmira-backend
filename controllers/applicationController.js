import Application from "../models/application.js";
import Job from "../models/jobs.js"
import User from "../models/users.js";
import HttpError from "../middlewares/httpError.js"

//add
export const createApplication = async (req, res, next) => {
    try{
        const role = req.userData.user_role;
          if (role == 'admin') return
        
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

        const {prevPosition, prevCompany} = req.body

        const application = await new Application({
            user: user._id,
            job: job._id,
            resume: resumePath,
            prevPosition,
            prevCompany,
            contactInfo: {
                name: user.name,
                email: user.email,
                phone: user.phone,
            }
        }).save();

        res.status(201).json({
            status: true,
            message: "Application submitted successfully",
            data: application
        });
    } catch (err) {
        console.error("Create Application error:", err);
        return next(new HttpError("Failed to submit", 500));
    }
};

//view
export const viewApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_role, user_id } = req.userData; 

    let getApplication = await Application.findById(id)
    .select("user job appliedAt resume contactInfo prevPosition prevCompany status isRead")
    .populate([
        { path: "user", select: "name" },
        { 
        path: "job", 
        select: "title company",
        populate: { path: "company", select: "name" }  
        }
    ]);


    if (!getApplication) {
      return next(new HttpError("Application not found", 404));
    }

    if (user_role !== "admin") {
      if (getApplication.user._id.toString() !== user_id.toString()) {
        return next(new HttpError("Not authorized to view this application", 403));
      }
    }

    if (user_role === "admin") {
    let shouldSave = false;

    if (getApplication.status === "applied") {   
        getApplication.status = "under review";
        shouldSave = true;
    }

    if (!getApplication.isRead) {
        getApplication.isRead = true;
        shouldSave = true;
    }

    if (shouldSave) {
        await getApplication.save();
    }
    }
    
    res.status(200).json({
      status: true,
      message: "success",
      data: getApplication,
    });
  } catch (err) {
    return next(new HttpError("Failed to fetch application details", 500));
  }
};



// list
// export const listApplication = async (req, res, next) => {
//   try {
//     const { user_role, user_id } = req.userData;

//     if (user_role === "admin") {
//       const listedApplications = await Application.find()
//         .select("user job appliedAt status resume contactInfo")
//         .populate([
//           { path: "user", select: "name" },
//           { 
//             path: "job", 
//             select: "title company",
//             populate: { path: "company", select: "name" } 
//           }
//         ])
//         .sort({ createdAt: -1 });

//       if (listedApplications.length === 0) {
//         return next(new HttpError("No applications found", 404));
//       }

//       return res.status(200).json({
//         status: true,
//         message: "success",
//         data: listedApplications,
//       });
//     } 
    
//     else {
//       const appliedApplication = await Application.find({ user: user_id })
//         .select("job appliedAt status resume")
//         .populate([
//           { 
//             path: "job", 
//             select: "title company",
//             populate: { path: "company", select: "name" } 
//           }
//         ])
//         .sort({ createdAt: -1 });

//       return res.status(200).json({
//         status: true,
//         message: "success",
//         data: appliedApplication,
//       });
//     }
//   } catch (err) {
//     console.error("failed to list application", err);
//     return next(new HttpError("Failed to fetch application details", 500));
//   }
// };

export const listApplication = async (req, res, next) => {
  try {
    const { user_role, user_id } = req.userData;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (user_role !== "admin") {
      filter = { user: user_id };
    }

    const query = Application.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (user_role === "admin") {
      query
        .select("user job appliedAt status resume contactInfo")
        .populate([
          { path: "user", select: "name" },
          {
            path: "job",
            select: "title company",
            populate: { path: "company", select: "name" },
          },
        ]);
    } else {
      query
        .select("job appliedAt status resume")
        .populate([
          {
            path: "job",
            select: "title company",
            populate: { path: "company", select: "name" },
          },
        ]);
    }

    const [applications, total] = await Promise.all([
      query.exec(),
      Application.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      status: true,
      message: "success",
      data: applications,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("failed to list application", err);
    return next(new HttpError("Failed to fetch application details", 500));
  }
};




//edit status
export const editApplicationStatus = async (req, res, next) => {
    try{
        const {id} = req.params;
        const {user_role} = req.userData;
        const {status} = req.body;

        if (user_role !== "admin") {
            return next(new HttpError("Only admins can edit status", 403));
        }

        if (!status) {
            return next(new HttpError("Status required", 400));
        }

        const allowedStatuses = ["rejected", "selected"]
        if(!allowedStatuses.includes(status)) {
            return next(new HttpError(`Invalid status. Allowed: ${allowedStatuses.join(", ")}`, 422));
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).select("status user job");

        if (!updatedApplication) {
            return next(new HttpError("Application not found", 404));
        }

        res.status(200).json({
            status: true,
            message: "Application status updated",
            data: updatedApplication,
        });

    } catch(err) {
        console.error("Error updating application status:", err);
        return next(new HttpError("Failed to update application status", 500));
    }
};

//delete
export const deleteApplication = async (req, res, next) => {
    try{
        const {id} = req.params;
        
        const del = await Application.findOneAndDelete({_id: id})

        if(!del) {
            return next(new HttpError("Job not found", 404));
        }

        res.status(202).json({
            status: true,
            message: "successfully deleted",
            data: ""
        })

    } catch(err) {
        return next(new HttpError("Error deleting Job", 500));
    }
};