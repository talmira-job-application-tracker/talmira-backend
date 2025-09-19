import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    keywords: {
        type: [String], 
        required: true,
    },
    location: {
        type: String, 
        default: '',
    },
    message: {
        type: String,
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false, 
    },

    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true }); 


const Alert = mongoose.model('Alert', alertSchema);
export default Alert;