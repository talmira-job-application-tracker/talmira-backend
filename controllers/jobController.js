import HttpError from '../middlewares/httpError.js';
import Job from '../models/jobs.js'

export const listJob = async (req, res, next) => {

    try{
        const { user_id } = req.userData;
        let filter = {is_deleted: false };

        const listedJobs = await Job.find(filter)
        .select("title description company location jobType salary language qualification keyword isRemote")
        .populate({
            path: "company",
            select: "name"
        })
        .sort({createdAt: -1});

        res.status(200).json({
            status: true,
            message: "",
            data: listedJobs,
        });
    } catch (err){
        return next(new HttpError('Error fetching jobs', 500));
    }
};