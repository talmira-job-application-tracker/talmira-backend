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

    isActive: {
        type: Boolean,
        default: true,
    },

    skills: {
        type: [String],
        default: [],
    },
  
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;