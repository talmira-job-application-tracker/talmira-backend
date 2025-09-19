import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  mode: {
    type: String,
    enum: ["Online", "In-person", "Phone"],
    required: true,
  },
  location: {
    type: String,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
