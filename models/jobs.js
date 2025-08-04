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
      type: String,
      required: true
    },

    qualification: {
      type: String,
      required: true
    },

    keyword: {
      type: String
    },

    isRemote: {
      type: Boolean,
      required: true
    },

    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true  
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
