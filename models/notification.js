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

    isActive: {        //for toggle
        type: Boolean,
        default: true,
    },
}, { timestamps: true }); 


const Alert = mongoose.model('Alert', alertSchema);
export default Alert;