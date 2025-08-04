

import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['applied', 'under review', 'rejected', 'selected'],
      default: 'applied',
    },
    resume: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
