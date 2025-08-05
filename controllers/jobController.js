import { validationResult } from "express-validator";
import HttpError from '../middlewares/httpError.js';
import Job from '../models/jobs.js'

//list
export const listJob = async (req, res, next) => {

    try{
        const listedJobs = await Job.find()
        .select("title description company location jobType salary language qualification keyword workMode")
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

//view
export const viewJob = async ( req, res, next ) => {
    try{
        const {id} = req.params

        let getJob = await Job.findById(id)
        .select("title description company location jobType salary language qualification workMode")
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

    } catch (err){
        return next(new HttpError("Failed to fetch job details", 500));
    }
}

//add
export const addJob = async( req, res, next) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
                return next(new HttpError("Invalid inputs,please check again",422))
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
                workMode
            } = req.body  
            
            const addedJob = await new Job({
                title,
                description,
                company,
                location,
                jobType,
                salary,
                language,
                qualification,
                keyword,
                workMode
            }).save()
    
            res.status(201).json({
                status: true,
                message: "successfully added job",
                data: addedJob
            });
    } catch (err) {
        console.error('Failed adding job',err);
        return next(new HttpError("Job Creation Failed", 500));
    }
};

//edit
export const editJob = async (req, res, next) => {
    try{
        const errors = validationResult(req)
         if (!errors.isEmpty()) {
            return next(new HttpError("Invalid input , please try again",422));
        }

        const {id} = req.params
        const {user_role} = req.userData
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
                workMode
            } = req.body

        if(user_role !== "admin") {
            return next(new HttpError("Access Denied, only admins can edit", 403));
        }

        const updatedJob = {
            title, 
            description, 
            company, 
            location, 
            jobType, 
            salary, 
            language, 
            qualification, 
            keyword, 
            workMode
        }

        const editedJob = await Job.findOneAndUpdate(
            {_id: id},
            updatedJob,
            {new: true},
        )

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

//search
export const searchJob = async(req, res, next) => {
    try{
        const { title, location, jobType, workMode, keyword } = req.query;

        let query = {};

        if (title) {
        query.title = { $regex: title, $options: "i" }; // fuzzy search
        }

        if(location) {
            query.location = { $regex: location, $options: "i" }
        }

        if (jobType) {
        query.jobType = jobType;
        }

        if (workMode) {
        query.workMode = workMode;
        }

        if (keyword) {
        query.keyword = { $regex: keyword, $options: "i" };
        }

        const results = await Job.find(query)
        .select("title company location jobType salary workMode keyword")
        .populate({ path: "company", select: "name" });

        res.status(200).json({
            status: true,
            message: "Jobs fetched successfully",
            data: results,
        });
    } catch (err) {
        console.error("Search Job Error Stack:", err);
        return next(new HttpError("Failed to search jobs", 500));
    }
};