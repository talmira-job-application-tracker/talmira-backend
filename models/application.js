import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
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
    contactInfo: {
      name: String,
      email: String,
      phone: String
    }
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
