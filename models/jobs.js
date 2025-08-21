import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", 
      required: true
    },

    location: {
      type: String,
      required: true
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true
    },

    salary: {
      type: String,
      required: true
    },

    language: {
      type: [String],
      
    },

    qualification: {
      type: String,
      required: true
    },

    keyword: {
      type: [String]
    },

    workMode: {
      type: String,
      enum: ["Hybrid", "On-Site", "Remote"],
      default: "On-Site",
      required: true
    }
  },
  {
    timestamps: true  
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
